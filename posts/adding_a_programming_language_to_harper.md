# Adding a Programming Language to Harper

When I started the [Harper project](https://github.com/automattic/harper) I knew I wanted to be able to use it for the comments in my code.
First, because I knew these comments would become part of our official documentation over time, and because I hoped it would encourage me to write more.
Over time, this has become one of the most prized features of the software, attracting tens of thousands of developers.

The common problem, however, is that there have always been programming languages that our LSP doesn't support.
One of the [oldest issues](https://github.com/Automattic/harper/issues/79) on GitHub is about this.

This post is a guide for adding a new programming language to the Harper language server.
Why isn't it in the official documentation?
While the information contained within this guide will remain relevant to the project for a long time, I don't imagine each identifier or file path to remain the same.
If you think it _would_ better serve potential contributors to place this guide on the [main site](https://writewithharper.com), let me know.

## Introduction to Tree-sitter

[Tree-sitter](https://tree-sitter.github.io/tree-sitter/) is fantastic framework for building fault-tolerant language parsers.
That means it is still able to parse the majority of a document, even if it contains portions of invalid syntax.

This is important for Harper, since we expect people to use Harper _while_ their programming.
It should be OK if some of their code is incorrect, since we only care about their comments.

There are also a wide variety of Tree-sitter parsers available on [crates.io](https://crates.io/), ripe for our consumption.
If you want to add a language to Harper, this is the easiest way to do so.

## Step 0: Avoid Duplicating Work

You're interested in adding support for a programming language.
If that's the case, it's possible other people are too.
Make sure no one else has [opened a PR](https://elijahpotter.dev/articles/never_wait) or [has already merged support](https://writewithharper.com/docs/integrations/language-server#Supported-Languages) for the language you have in mind.

## Step 1: Find a Grammar

Look for an existing grammar on [crates.io](https://crates.io).
By convention, they tend to be named `tree-sitter-<language>`, where `<language>` is the language you're looking for. For example, [`tree-sitter-java`](https://crates.io/crates/tree-sitter-java) is for Java and [`tree-sitter-rust`](https://crates.io/crates/tree-sitter-rust) is for Rust.

If you would rather write your own grammar, make sure it is eventually published on `crates.io`.
`harper-ls` binaries are often consumed from `crates.io`, which requires that all upstream dependencies come from the same source.

## Step 2: Import and Wire In

Harper's comment support lies in the `harper-comments` crate in [the monorepo](https://github.com/automattic/harper/).
Import the grammar's crate into the project with Cargo.

```bash
cargo add <CRATE-NAME>
```

Then, add lines to the relevant functions in `harper-comments/src/comment_parser.rs`.
Make sure you visit the [Language Server Protocol Specification](https://microsoft.github.io/language-server-protocol/) to obtain the correct language ID.

```rust
pub fn new_from_language_id(
    language_id: &str,
    markdown_options: MarkdownOptions,
) -> Option<Self> {
    let language = match language_id {
        "cmake" => tree_sitter_cmake::LANGUAGE,
        "cpp" => tree_sitter_cpp::LANGUAGE,
        "csharp" => tree_sitter_c_sharp::LANGUAGE,
        "c" => tree_sitter_c::LANGUAGE,
        "dart" => harper_tree_sitter_dart::LANGUAGE,
        "go" => tree_sitter_go::LANGUAGE, // Add a line here
```

```rust
/// Convert a provided path to a corresponding Language Server Protocol file
/// type.
///
/// Note to contributors: try to keep this in sync with
/// [`Self::new_from_language_id`]
fn filename_to_filetype(path: &Path) -> Option<&'static str> {
    Some(match path.extension()?.to_str()? {
        "bash" => "shellscript",
        "c" => "c",
        "cmake" => "cmake",
        "cpp" => "cpp",
        "cs" => "csharp",
```

## Step 3: Document

To advertise support for the language, there are a couple addition places that need modification.
Notably:

- The supported languages table in `packages/web/src/routes/docs/integrations/language-server/+page.md`
- The [GitHub Issue](https://github.com/Automattic/harper/issues/79)
- The `activationEvents` key in the VS Code plugin's manifest: `packages/vscode-plugin/package.json`

## Done!

That should be everything.
Open a draft pull request while you work and ping me ([elijah-potter](https://github.com/elijah-potter/)) if you have any questions.
