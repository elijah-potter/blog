# Writing an Expression Rule for Harper

_This is part of a series.
[Go to the start.](./writing_a_grammatical_rule_for_harper)_

Expression rules (or more commonly, `ExprLinter`s) are Harper rules that use declarative expressions to find and fix grammatical errors.
They're halfway between a "phrase correction" and manually implementing `Linter`.

Make sure you properly [set up your environment](https://writewithharper.com/docs/contributors/environment).

Before we get started, let's take a look at the `ExprLinter` trait.
Here's what it looks like at the time of writing this post.

```rust
/// A trait that searches for tokens that fulfil [`Expr`]s in a [`Document`].
///
/// Makes use of [`TokenStringExt::iter_chunks`] to avoid matching across sentence or clause
/// boundaries.
#[blanket(derive(Box))]
pub trait ExprLinter: LSend {
    /// A simple getter for the expression you want Harper to search for.
    fn expr(&self) -> &dyn Expr;
    /// If any portions of a [`Document`] match [`Self::expr`], they are passed through [`ExprLinter::match_to_lint`] to be
    /// transformed into a [`Lint`] for editor consumption.
    ///
    /// This function may return `None` to elect _not_ to produce a lint.
    fn match_to_lint(&self, matched_tokens: &[Token], source: &[char]) -> Option<Lint>;
    /// A user-facing description of what kinds of grammatical errors this rule looks for.
    /// It is usually shown in settings menus.
    fn description(&self) -> &str;
}
```

The structure of the trait reveals some of the behind-the-scenes work Harper is doing for you.
There are three phases:

1. You provide Harper an `Expr`.
   It will iterate through the document, looking for token sequences that match your expression.
2. Any and all matches are passed to `match_to_lint`.
   From there, you can perform optional additional validation to confirm that the tokens really do represent a grammatical error.
   If so, return `None`.
   Otherwise, return a `Lint` with any suggestions that may fix the problem.
3. Harper will handle everything else. It will show UI, reformat text, and settings menus to the user.
   It will also perform aggressive caching on the first two steps, so any modifications to the document have a negligible performance impact.

## Let's Get Started

Now that we've reviewed the essentials, let's implement an `ExprLinter`.

Before we can write a single line of code, we need a grammatical rule of interest.
I'm going to pay a visit to the Harper [issue board](https://github.com/Automattic/harper/issues?q=is%3Aissue%20state%3Aopen%20label%3Aenhancement%20label%3Aharper-core%20label%3Alinting).

After looking through a few options, I think [#1513](https://github.com/Automattic/harper/issues/1513) is a good candidate.
We are looking for missing prepositions between an adjective and a subject.

To get started, we'll create a file under `harper-core/src/linting` called `missing_preposition.rs` and add it to the parent Rust module.
I'll paste the template into the file:

```rust
pub struct MissingPreposition {
    expr: Box<dyn Expr>,
}

impl Default for MissingPreposition {
    fn default() -> Self {
        let expr = todo!();

        Self {
            expr: Box::new(expr),
        }
    }
}


impl ExprLinter for MissingPreposition {
    fn expr(&self) -> &dyn Expr {
        self.expr.as_ref()
    }

    fn match_to_lint(&self, matched_tokens: &[Token], _source: &[char]) -> Option<Lint> {
        unimplemented!()
    }

    fn description(&self) -> &'static str {
        unimplemented!()
    }
}
```

I like to start by building out a few test cases before working on the actual code.
We get some for free from the GitHub issue:

```rust
#[test]
fn fixes_issue_1513() {
    assert_lint_count(
        "The city is famous its beaches.",
        MissingPreposition::default(),
        1,
    );
    assert_lint_count(
        "The students are interested learning.",
        MissingPreposition::default(),
        1,
    );
}
```

Obviously, these tests will fail if we try to run `cargo test`, but at this point you should do so anyway to make sure your toolchain is working.

## Writing our Expression

The heart of this grammatical rule is the `Expr` (pronounced _expression_).
There are a number of ways to go about making one of these.
The simplest (and most common by far) is to put together a [`SequenceExpr`](https://docs.rs/harper-core/latest/harper_core/expr/struct.SequenceExpr.html).

In our case, we're looking for missing prepositions between an adjective and a noun.
A good expression to start with could look like:

```rust
impl Default for MissingPreposition {
    fn default() -> Self {
        let expr = SequenceExpr::default()
            .then(UPOSSet::new(&[UPOS::ADJ]))
            .t_ws()
            .then(UPOSSet::new(&[UPOS::NOUN, UPOS::PRON, UPOS::PROPN]));

        Self {
            expr: Box::new(expr),
        }
    }
}
```

We're using a `UPOSSet` here, which is another kind of `Expr` that looks for specific parts of speech.
The name derives from the [Universal Dependencies tag system](https://universaldependencies.org/u/pos/index.html).
Any tokens tagged with any of the options we've provided to the `UPOSSet` will match.

However, it's easy to create an example that this expression matches against, but doesn't contain a grammatical error.
We call this a false positive.
Let's write one and add it to our test suite.

```rust
#[test]
fn allows_terrible_stuff() {
    assert_no_lints(
        "Either it was terrible stuff or the whiskey distorted things.",
        MissingPreposition::default(),
    );
}
```

From here, you should use your brain to continuously refine the expression into something that
maintains a low false-positive rate while remaining useful.
Here's what I settled on:

```rust
impl Default for MissingPreposition {
    fn default() -> Self {
        let expr = SequenceExpr::default()
            .then(
                AnchorStart.or(SequenceExpr::default()
                    .then(UPOSSet::new(&[UPOS::DET]))
                    .t_ws()),
            )
            .then(UPOSSet::new(&[UPOS::NOUN, UPOS::PRON, UPOS::PROPN]))
            .t_ws()
            .then(UPOSSet::new(&[UPOS::AUX]))
            .t_ws()
            .then(UPOSSet::new(&[UPOS::ADJ]))
            .t_ws()
            .then(UPOSSet::new(&[UPOS::NOUN, UPOS::PRON, UPOS::PROPN]))
            .then_optional(AnyPattern)
            .then_optional(AnyPattern);

        Self {
            expr: Box::new(expr),
        }
    }
}
```

Now that we have an effective expression as a base, let's fill out the remaining fields.
I found checking for an adposition reduced the false-positive rate, and it was easiest to add it to the `match_to_lint` function.

```rust
impl ExprLinter for MissingPreposition {
    fn expr(&self) -> &dyn Expr {
        self.expr.as_ref()
    }

    fn match_to_lint(&self, matched_tokens: &[Token], _source: &[char]) -> Option<Lint> {
        if matched_tokens.last()?.kind.is_upos(UPOS::ADP) {
            return None;
        }

        Some({
            Lint {
                span: matched_tokens[2..4].span()?,
                lint_kind: LintKind::Miscellaneous,
                suggestions: vec![],
                message: "You may be missing a preposition here.".to_owned(),
                priority: 31,
            }
        })
    }

    fn description(&self) -> &'static str {
        "Locates potentially missing prepositions."
    }
}
```

That's it!
We've written our rule.

Don't forget to [register your rule](https://writewithharper.com/docs/contributors/author-a-rule#Register-Your-Rule) and add some more tests before opening PR.
Make sure you take a look at the [pull request](https://github.com/Automattic/harper/pull/1530) to see the finished rule.
