# Why Rust Might Attract More Developers Than Java and JavaScript

Rust is undeniably a greatly appreciated language, after all, it has placed as "#1 Most Loved Programming Language" on the StackOverflow Developer Survey for 6th year running.

Reading this, you are probably very aware of why so many people like it, but I will be going over those reasons anyway, at least before I reveal its secret weapon.

**It’s fast, very fast**. While it may not be a great benchmark, The Computer Language Benchmarks Game, measures that it falls just a hair behind the fastest language, **C**.

That makes sense, given that Rust was meant to replace C/C++. Even better than the benchmark, it has been shown that in many situations, the Rust compiler is able to optimize code significantly better than C or C++, just because it has more information about the developers intent.

**It’s consistent**. For more than pretty much any other language, Rust developers can expect that, if their code compiles, it works. When it doesn’t compile, the compiler gives better feedback and advice than any other language. It can even check if your arithmetic is wrong.

**It’s complicated**, but only where it needs to be. The language itself, as well as its standard library are built very consciously, by its users. Most places where you might find you have to write tedious boilerplate, Rust makes it easy. It also gives you the freedom to write code that does exactly what you want, exactly how you want. We will get back to this later.

## The Problem

When starting a new project what is the first thing you are going to do? It depends on what stack you are using.

If you want to use NodeJS, it might look something like:

```bash
mkdir new_project
touch index.js
npm install
```

That is just the bare minimum. If you want to add any dependencies, you have to go through an unreasonable number of hoops, and the standard package repository, npm, is known for being quite insecure, not to mention it being controlled by a private corporation.

If you want to use Java, you have to use some kind of template, otherwise it’s impossible to create a project from scratch. Even then, you have to decide between two or three package managers, and deal with it when libraries don’t support your choice.

If you want to use C or C++ forget it. As a beginner, you are going to be stuck figuring out how to use the local linker and compiler to get any library to work.

## The Rusty Solution

**Cargo** is one of the simplest, easiest to use build tools out there. It does everything you might need, and it may be why Rust may soon become a major player. 99% of the time, you can just copy and paste a given library’s string directly from [crates.io](https://crates.io), which is a repository owned and operated by the Rust Foundation, and you are off to the races.

Testing is easy too, just run `cargo test`, and you're done. It covers both unit tests, and integration tests if you need it.

`cargo doc`` provides a consistent, and easy way to document code. It’s also great for users, allowing developers access to a straightforward representation of what a library looks like.

**It’s extensible**, some of the greatest binary crates out there exist to extend the functionality. So, in the few areas where `cargo` on its own doesn’t cut it, there are additional crates to fill the gaps.

## Closing

At least for the moment, of all the great reasons to use Rust, `cargo` will be the most significant reason it will increase in popularity.

![Most loved programming languages, according to the 2021 StackOverflow Developer Survey](/images/most_loved_stackoverflow_2021.png)

Rust can be tough to learn, especially for people who are used to dynamic languages like JavaScript. But what Rust has beat for most languages is the build system. `cargo` alone makes Rust more approachable than C/C++, Java and many others.

More and more new developers will be going to Rust instead of those other languages, because it is easier to start with, easier to learn, and has a great community to request help from.
