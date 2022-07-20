use std::collections::HashMap;
use std::io;
use std::path::Path;

use askama::Template;
use log::info;
use tokio::fs;

const MINIFY_CFG: minify_html::Cfg = minify_html::Cfg {
    do_not_minify_doctype: true,
    ensure_spec_compliant_unquoted_attribute_values: true,
    keep_closing_tags: true,
    keep_html_and_head_opening_tags: true,
    keep_spaces_between_attributes: true,
    keep_comments: false,
    minify_css: true,
    minify_js: true,
    remove_bangs: false,
    remove_processing_instructions: false,
};

pub struct BlogPost {
    pub endpoint: String,
    pub content: String,
}

impl BlogPost {
    pub fn render(&self, dark: bool) -> Vec<u8> {
        let Self { endpoint, content } = self;

        BlogPostTemplate {
            dark,
            endpoint,
            content,
        }
        .render()
        .unwrap()
        .into_bytes()
    }

    pub fn render_minified(&self, dark: bool) -> Vec<u8> {
        let rendered = self.render(dark);

        minify_html::minify(&rendered, &MINIFY_CFG)
    }
}

pub struct BlogPostList {
    posts: Vec<BlogPost>,
    endpoint_map: HashMap<String, usize>,
}

impl BlogPostList {
    pub fn render(&self, dark: bool) -> Vec<u8> {
        BlogPostListTemplate {
            dark,
            posts: self.posts.as_slice(),
        }
        .render()
        .unwrap()
        .into_bytes()
    }

    pub fn render_minified(&self, dark: bool) -> Vec<u8> {
        let rendered = self.render(dark);

        minify_html::minify(&rendered, &MINIFY_CFG)
    }

    pub fn get_post(&self, endpoint: &str) -> Option<&BlogPost> {
        let index = self.endpoint_map.get(endpoint)?;

        self.posts.get(*index)
    }

    pub fn posts(&self) -> &[BlogPost] {
        self.posts.as_slice()
    }
}

pub struct Index;

impl Index {
    pub fn render(&self, dark: bool) -> Vec<u8> {
        IndexTemplate { dark }.render().unwrap().into_bytes()
    }

    pub fn render_minified(&self, dark: bool) -> Vec<u8> {
        let rendered = self.render(dark);

        minify_html::minify(&rendered, &MINIFY_CFG)
    }
}

/// Renders all *.md files in a directory to finished pages.
pub async fn load_posts(path: &Path) -> io::Result<BlogPostList> {
    let mut stream = fs::read_dir(path).await?;
    let mut posts = Vec::new();
    let mut endpoint_map = HashMap::new();

    while let Some(file) = stream.next_entry().await? {
        if file.file_type().await.unwrap().is_file() {
            let file_contents = std::fs::read(file.path()).unwrap();
            let file_contents_str = String::from_utf8(file_contents).unwrap();

            let endpoint = file
                .path()
                .file_stem()
                .unwrap()
                .to_string_lossy()
                .to_lowercase();

            info!("Added {endpoint}");

            endpoint_map.insert(endpoint.clone(), posts.len());

            posts.push(BlogPost {
                endpoint,
                content: file_contents_str,
            })
        }
    }

    Ok(BlogPostList {
        posts,
        endpoint_map,
    })
}

#[derive(Template)]
#[template(path = "post.html")]
struct BlogPostTemplate<'a> {
    pub dark: bool,
    pub endpoint: &'a str,
    pub content: &'a str,
}

#[derive(Template)]
#[template(path = "list.html")]
struct BlogPostListTemplate<'a> {
    pub dark: bool,
    pub posts: &'a [BlogPost],
}

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate {
    pub dark: bool,
}

mod filters {
    pub fn titleize(s: &str) -> ::askama::Result<String> {
        Ok(itertools::intersperse(
            s.split('_').map(|s| {
                let mut s = s.to_string();
                s.replace_range(0..1, &s[0..1].to_uppercase());
                s
            }),
            " ".to_string(),
        )
        .collect())
    }
}
