# Why You Need `sccache`

As the maintainer of a [reasonably popular open source project](https://writewithharper.com) written in Rust, I find myself cloning PRs and swapping between branches dozens of times a day.
In doing so, I often blow away Rust's compilation cache either via `git clean -xf .` or by changing dependency versions.

Having a build cache that is separate from the project is a huge win for compile times, which is why I use [`sccache`](https://github.com/mozilla/sccache).

For those unaware, `sccache` is a build tool for C, C++ and Rust projects that stands in front of the compiler.
If a given file's hash is the same across calls to the compiler, `sccache` reuses the previous result.
This cache is compiler–and project agnostic.
In my case, it sits in `$HOME/.scccache`, but you can set it up with AWS S3, Redis or a myriad of other options.

If a dependency is cached from a compile in one project, it is available for a build in another.

In short: you need `sccache` if you are frequently swapping between branches with similar (but not identical) dependencies or expect to frequently delete Rust's disk cache.

## Why You Don't Need `sccache`

If you are working in a single branch on a project whose dependencies remain somewhat stable, `sccache` might actually increase your compile time.
Since `sccache` has to hit the disk (or even the network) regardless of whether it is a cache hit, a little bit of latency is added.
If you expect most compiles to be cache hits or most compiles to be cache misses, `sccache` is no more useful than the built-in caching `cargo` provides.

In that case you should not use `sccache`.

## Wrap-Up

Regardless of whether you install `sccache` on your machine, it is a neat little technology.
I would recommend the curious reader take a look for themselves.
You might be inspired.
