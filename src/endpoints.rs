use std::path::Path;

use actix_web::cookie::{Cookie, SameSite};
use actix_web::http::header::{HeaderValue, LOCATION, REFERER};
use actix_web::web::{self, ServiceConfig};
use actix_web::{get, post, HttpRequest, HttpResponse};

use crate::templates::{load_posts, Index};

static HOMEPAGE: HeaderValue = HeaderValue::from_static("/");

pub fn setup(cfg: &mut ServiceConfig) {
    cfg.service(index)
        .service(toggle_dark)
        .service(get_post)
        .service(get_post_listing);
}

#[get("/")]
async fn index(request: HttpRequest) -> HttpResponse {
    let dark = get_dark_cookie(&request);

    let index = Index {};

    HttpResponse::Ok().body(index.render_minified(dark))
}

#[post("/toggledark")]
async fn toggle_dark(request: HttpRequest) -> HttpResponse {
    let dark = get_dark_cookie(&request);

    let toggle_cookie = Cookie::build("dark", (!dark).to_string())
        .same_site(SameSite::Strict)
        .finish();

    let referrer = request.headers().get(REFERER).unwrap_or(&HOMEPAGE);

    HttpResponse::Found()
        .cookie(toggle_cookie)
        .insert_header((LOCATION, referrer))
        .finish()
}

#[get("/blog")]
async fn get_post_listing(request: HttpRequest) -> Option<HttpResponse> {
    let dark = get_dark_cookie(&request);

    let posts = load_posts(Path::new("./posts")).await.ok()?;

    Some(HttpResponse::Ok().body(posts.render_minified(dark)))
}

#[get("/blog/{title}")]
async fn get_post(request: HttpRequest, path: web::Path<(String,)>) -> Option<HttpResponse> {
    let dark = get_dark_cookie(&request);

    let blog_endpoint = path.into_inner().0;

    let posts = load_posts(Path::new("./posts")).await.ok()?;

    let post = posts.get_post(&blog_endpoint)?;

    Some(HttpResponse::Ok().body(post.render_minified(dark)))
}

fn get_dark_cookie(request: &HttpRequest) -> bool {
    request
        .cookie("dark")
        .map(|c| c.value().parse())
        .unwrap_or(Ok(false))
        .unwrap_or(false)
}
