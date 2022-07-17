mod generator;
mod templates;
use std::future;

use actix_web::http::header::CACHE_CONTROL;

use actix_web::{
    cookie::{Cookie, SameSite},
    http::header::{HeaderValue, LOCATION, REFERER},
    middleware::{Compress, Logger},
    post, App, HttpRequest, HttpResponse, HttpServer, Route,
};
use log::info;

static HOMEPAGE: HeaderValue = HeaderValue::from_static("/");

#[tokio::main]
async fn main() {
    env_logger::init();

    let mut generator = generator::BlogGenerator::new();

    info!("Generating pages...");

    for file in std::fs::read_dir("posts").expect("Could not open \"posts\" directory.") {
        let file = file.unwrap();

        if file.file_type().unwrap().is_file() {
            let file_contents = std::fs::read(file.path()).unwrap();
            let file_contents_str = String::from_utf8(file_contents).unwrap();

            let endpoint = file
                .path()
                .file_stem()
                .unwrap()
                .to_string_lossy()
                .to_lowercase();

            info!("Added {endpoint}");

            generator.update_or_add(endpoint, &file_contents_str);
        }
    }

    macro_rules! static_file {
        ($endpoint:literal) => {
            |cfg| {
                cfg.route(
                    $endpoint,
                    Route::new().to(|| {
                        future::ready(HttpResponse::Ok().insert_header((CACHE_CONTROL, "max_age=3600")).body(include_bytes!(concat!("../static/", $endpoint)).to_vec()))
                    }),
                );
            }
        };
    }

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(Compress::default())
            .configure(static_file!("favicon.ico"))
            .configure(static_file!("profile.svg"))
            .configure(static_file!("charter_regular.woff2"))
            .configure(static_file!("charter_bold.woff2"))
            .configure(static_file!("charter_italic.woff2"))
            .configure(static_file!("charter_bold_italic.woff2"))
            .service(toggle_dark)
            .service(generator.clone().into_resource())
    })
    .bind(("0.0.0.0", 8080))
    .unwrap()
    .run()
    .await
    .unwrap();
}

#[post("/toggledark")]
async fn toggle_dark(request: HttpRequest) -> HttpResponse {
    let dark = request
        .cookie("dark")
        .map(|c| c.value().parse())
        .unwrap_or(Ok(false))
        .unwrap_or(false);

    let toggle_cookie = Cookie::build("dark", (!dark).to_string())
        .same_site(SameSite::Strict)
        .finish();

    let referrer = request.headers().get(REFERER).unwrap_or(&HOMEPAGE);

    HttpResponse::Found()
        .cookie(toggle_cookie)
        .insert_header((LOCATION, referrer))
        .finish()
}
