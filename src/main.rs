mod generator;
use std::future;

use actix_web::{
    cookie::{Cookie, CookieBuilder, SameSite},
    get,
    http::header::{HeaderValue, LOCATION, REFERER, REFRESH, SET_COOKIE},
    middleware::{Logger, Compress},
    post, web, App, HttpRequest, HttpResponse, HttpServer, Responder, Route, Handler,
};

static HOMEPAGE: HeaderValue = HeaderValue::from_static("/");

#[tokio::main]
async fn main() {
    let mut generator = generator::BlogGenerator::new();
    generator.update_or_add("test", "This is a test");
    generator.update_or_add("medium", r#"
## Addressing History

Reflecting on my last post, I identified the one key element that was missing: context. Reading through the comments on Reddit made it clear that some figured that I was an old man, reveling in nostalgia for "the simpler days". That isn't the case. I am actually relatively new to the software development industry. While I feel like I have a solid base understanding of the act of *writing* software, I have relatively little experience doing so in a professional context, especially collaboratively. When I initially sat down to write my last post, my intent was to discuss a recent experience of mine and process through it. As many of you can tell, that did not end up happening. The final product ended being, as one commenter put it:

> "-a very emotional post with little data points or tangible evidence."

I honestly don't know how that ended up happening. Re-reading it, I understand and agree with a lot of the feedback I received. The intention with this post is to clarify the ideas I hand-waved towards previously, and hopefully amend that conflict I raised.

## Context

I think for the sake of argument, I won't specify which languages or tools I am talking about.

I recently began learning more and using Language Z. I had avoided going deep into it's intricacies and details prior to this endeavor because I had heard a lot of negative press about it, specifically from evangelists of Language X and Language Y, the two ecosystems I was (am) most comfortable with. Relative to X and Y, Language Z was *old*. Up until my true foray into Language Z, I had only heard of how strange and nonsensical it is. Not unlike early settlers of the Americas, I only had a single story of what to expect: a slow, hard to debug, backwards language meant for people who hadn't tried anything else.

As I learned more and more, I began to realize the danger of that line of thinking. Spending more time actually using Language Z, I realized that a lot of the criticisms were about a small set of edge cases. Cases where, the "nonsense" design decision actually became the logical option.

I understand how my previous article may make it seem like I don't appreciate these newer languages, and that I am opposed to wider adoption. This is not the case. New languages solve problems and make our jobs as developers safer and easier. But it becomes unhealthy when newer languages forced to replace older languages when it isn't necessary. For example, trying to use Rust instead of JavaScript for frontend web development. Unless the performance requirements remove JavaScript as an option, it just doesn't make sense. I really enjoy writing Rust, but that sounds like a nightmare to me.

## Why not use a newer language?

Keep in mind I am not speaking from experience, just explaining my thought process in the hope of discussion.

In plenty of cases, there isn't a good reason not to use one of the newer languages. Rapid development timelines may make some languages too verbose and unnecessarily complex. Performance or security requirements might make certain guarantees very attractive.

For some organizations, it may make a lot of sense to (forgive the buzzphrase) use a more battle-tested language and corresponding ecosystem. While age does not necessarily correlate with reliability or safety, continued use does also mean there are still people and orgianizations relying on these older ecosystems.

I think a good example of this is the recent Log4Shell zero-day vulnerability that most of you know about. If you haven't heard of it, I'm not sure how to help you. It was incredibly damaging and struck fear in the hearts of many, including mine. Fortunately, due to the excellent Apache Foundation and it's contributors, as well as members of the Alibaba corporation, the issue was solved with haste. That would not be the case if the Apache Foundation did not have the necessary resources and backing from the corporations and organizations it's code impacts.

## Final points

As I mentioned before, when I read through my previous article, I can identify some points that simply needed more clarification, and some things I don't understand myself. To those I offended or whose time I spent, I am sorry. I hope the act of clarification has made my thoughts clearer.
                            "#);

    env_logger::init();

    macro_rules! static_file {
        ($endpoint:literal) => {
            |cfg| {
                cfg.route($endpoint, Route::new().to(|| future::ready(include_bytes!("../static/charter_regular.woff2").to_vec())));
            }
        };
    }

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(Compress::default())
            .configure(static_file!("/charter_regular.woff2"))
            .configure(static_file!("/charter_bold.woff2"))
            .configure(static_file!("/charter_italic.woff2"))
            .configure(static_file!("/charter_bold_italic.woff2"))
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


