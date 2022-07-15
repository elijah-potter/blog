use std::{
    collections::HashMap,
    future::{self, Ready},
};

use actix_web::{
    guard::Get,
    http::header::ContentType,
    web::{Bytes, Path},
    Handler, HttpRequest, HttpResponse, Resource,
};
use askama::Template;

#[derive(Eq, PartialEq, Debug, Clone, Default, Hash)]
struct BlogKey {
    dark: bool,
    endpoint: String,
}

#[derive(Clone)]
pub struct BlogGenerator {
    map: HashMap<BlogKey, Bytes>,
}

impl BlogGenerator {
    pub fn new() -> Self {
        Self {
            map: HashMap::new(),
        }
    }

    pub fn update_or_add<S: ToString>(&mut self, name: S, markdown: &str) {
        // Render markdown to html
        let mut rendered_md = String::new();
        let parser = pulldown_cmark::Parser::new(markdown);
        pulldown_cmark::html::push_html(&mut rendered_md, parser);

        let light = Post {
            dark: false,
            content: rendered_md.as_str(),
        }
        .render()
        .unwrap();
        let dark = Post {
            dark: true,
            content: rendered_md.as_str(),
        }
        .render()
        .unwrap();

        let minify_cfg = minify_html::Cfg {
            do_not_minify_doctype: true,
            ensure_spec_compliant_unquoted_attribute_values: true,
            keep_closing_tags: true,
            keep_html_and_head_opening_tags: true,
            keep_spaces_between_attributes: false,
            keep_comments: false,
            minify_css: true,
            minify_js: true,
            remove_bangs: true,
            remove_processing_instructions: false,
        };

        let minified_light = minify_html::minify(light.as_bytes(), &minify_cfg);
        let minified_dark = minify_html::minify(dark.as_bytes(), &minify_cfg);

        self.map.insert(
            BlogKey {
                dark: false,
                endpoint: name.to_string(),
            },
            Bytes::copy_from_slice(minified_light.as_slice()),
        );
        self.map.insert(
            BlogKey {
                dark: true,
                endpoint: name.to_string(),
            },
            Bytes::copy_from_slice(minified_dark.as_slice()),
        );
    }

    pub fn into_resource(self) -> Resource {
        Resource::new("/{name}")
            .name("posts")
            .guard(Get())
            .to(BlogHandler { map: self.map })
    }
}

#[derive(Clone)]
struct BlogHandler {
    map: HashMap<BlogKey, Bytes>,
}

impl Handler<(HttpRequest, Path<(String,)>)> for BlogHandler {
    type Output = HttpResponse;
    type Future = Ready<Self::Output>;

    fn call(
        &self,
        (request, path): (HttpRequest, actix_web::web::Path<(std::string::String,)>),
    ) -> Self::Future {
        let (path,) = path.into_inner();
        let dark = request
            .cookie("dark")
            .map(|c| c.value().parse())
            .unwrap_or(Ok(false))
            .unwrap_or(false);

        let key = BlogKey {
            endpoint: path,
            dark,
        };

        let entry = self.map.get(&key);

        match entry {
            Some(page) => future::ready(
                HttpResponse::Ok()
                    .content_type(ContentType::html())
                    .body(page.to_owned()),
            ),
            None => future::ready(HttpResponse::NotFound().finish()),
        }
    }
}

#[derive(Template)]
#[template(path = "post.html", escape = "none")]
struct Post<'a> {
    dark: bool,
    content: &'a str,
}
