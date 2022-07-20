mod endpoints;
mod templates;
use std::future;

use actix_web::http::header::CACHE_CONTROL;
use actix_web::middleware::{Compress, Logger};
use actix_web::{App, HttpResponse, HttpServer, Route};

#[tokio::main]
async fn main() {
    env_logger::init();

    macro_rules! static_file {
        ($endpoint:literal) => {
            |cfg| {
                cfg.route(
                    $endpoint,
                    Route::new().to(|| {
                        future::ready(
                            HttpResponse::Ok()
                                .insert_header((CACHE_CONTROL, "max-age=3600"))
                                .body(include_bytes!(concat!("../static/", $endpoint)).to_vec()),
                        )
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
            .configure(static_file!("sun.svg"))
            .configure(static_file!("moon.svg"))
            .configure(static_file!("charter_regular.woff2"))
            .configure(static_file!("charter_bold.woff2"))
            .configure(static_file!("charter_italic.woff2"))
            .configure(static_file!("charter_bold_italic.woff2"))
            .configure(endpoints::setup)
    })
    .bind(("0.0.0.0", 3030))
    .unwrap()
    .run()
    .await
    .unwrap();
}
