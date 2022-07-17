use askama::Template;

#[derive(Template)]
#[template(path = "post.html")]
pub struct Post<'a> {
    pub dark: bool,
    pub title: &'a str,
    pub content: &'a str,
}

mod filters {
    pub fn titleize(s: &str) -> ::askama::Result<String> {
        Ok(itertools::intersperse(s.split('_').map(|s| {
            let mut s = s.to_string();
            s.replace_range(0..1, &s[0..1].to_uppercase());
            s
        }), " ".to_string()).collect())
    }
}
