# Writing a Phrase Correction for Harper

_This is part of a series.
[Go to the start.](./writing_a_grammatical_rule_for_harper)_

There are several ways to add a grammatical rule to Harper.
This post aims to outline the easiest (and most constrained): a "phrase correction".

Sometimes you'll see a simple but common grammatical error that doesn't have much to do with any broader context.
For example, I often mistype "in the" as "int he".
It happens quite often, and there isn't a broad pattern at play here.
This is a perfect candidate for a "phrase correction".

From a technical point of view, a "phrase correction" is just a mapping from one or more phrases to another set of phrases.
But they're more than a simple search-and-replace.
Under-the-hood, Harper will account for various capitalization and stylistic changes that can be difficult to cover manually.
Fortunately, they're pretty easy to add to Harper.

Before we begin, make sure you properly [set up your environment](https://writewithharper.com/docs/contributors/environment).

Open up the Harper [monorepo](https://github.com/automattic/harper).
In `harper-core/src/linting/phrase_corrections/mod.rs`, you'll find a list of entries that look somewhat like this:

```rust
"GildedAge" => (
    ["guilded age"],
    ["Gilded Age"],
    "The period of economic prosperity is called the `Gilded Age`.",
    "If referring to the period of economic prosperity, the correct term is `Gilded Age`."
),
"GoingTo" => (
    // The value to map _from_.
    ["gong to"], 
    // The suggestions to present to the user, which replace the problematic text.
    ["going to"], 
    // The message for the user.
    "Did you mean `going to`?",
    // The rule description to be shown in settings pages.
    "Corrects `gong to` to the intended phrase `going to`."
),
"GotRidOff" => (
    ["got rid off", "got ride of", "got ride off"],
    ["got rid of"],
    "Did you mean `got rid of`?",
    "Ensures `got rid of` is used instead of `got rid off`."
),
```

Each of these is a "phrase correction".
To add one for the problem I outlined above, we just need to append to the end of the list and open [a pull request](./never_wait).

```rust
"InThe" => (
    ["int he"],
    ["in the"],
    "Did you mean `in the`?",
    "Detects and corrects a spacing error where `in the` is mistakenly written as `int he`. Proper spacing is essential for readability and grammatical correctness in common phrases."
),
```

If you want to go the extra mile, we'd really appreciate if you added one or two test cases to `harper-core/src/linting/phrase_corrections/tests.rs` to make sure everything works as expected:

```rust
#[test]
fn corrects_int_he() {
    assert_suggestion_result(
        "That pizza stayed int he box.",
        lint_group(),
        "That pizza stayed in the box.",
    );
}
```
