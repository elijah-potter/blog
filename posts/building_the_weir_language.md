# Building the Weir Language

Most large organizations have a style guide.
A document that decides which versions of a linguistic rule to use.
That could be whether to use the Oxford comma, or if contractions are allowed.
It could declare that a certain word should be capitalized in a specific context.

Harper can cover *most* of the rules in *most* style guides, but there will always be outliers that we can't support (or simply don't know about).
That is why it is critical that Harper allow individuals and organizations to define rules and conventions for Harper to enforce.

For the last few days, I've been prototyping a simple (not Turing-complete) programming language for describing these conventions.
I've called it Weir.
Weir is simple and thus easy to learn, but has escape hatches for instances where more complex logic is necessary.

Before I begin, a quick disclaimer: This is early work. The Weir language will likely change and evolve before it makes it into core.
What you see here is representative of the overall design, but nothing is final yet.

## History

There are inevitably going to be a good number of edge cases that need to be addressed when building a grammar checker.
For these, Harper has a simple map from problematic phrases to the corrected versions.
Edge cases that are not simple enough to be described with a map are implemented as Rust code.
Here's what the map looks like:

```rust
add_exact_mappings!(group, {
    // The name of the rule
    "ACoupleMore" => (
        // The phrase(s) to look for.
        ["a couple of more"],
        // The corrections to provide.
        ["a couple more"],
        // The message to be shown with the error.
        "The correct wording is `a couple more`, without the `of`.",
        // A description of the rule.
        "Corrects `a couple of more` to `a couple more`.",
        LintKind::Redundancy
    ),
    "CondenseAllThe" => (
        ["all of the"],
        ["all the"],
        "Consider simplifying to `all the`.",
        "Suggests removing `of` in `all of the` for a more concise phrase.",
        LintKind::Redundancy
    ),
    "CoursingThroughVeins" => (
        ["cursing through veins"],
        ["coursing through veins"],
        "In this idiom, blood “courses” (flows) through veins, not “curses”.",
        "In English idioms, “to course” means to flow rapidly—so avoid the eggcorn `cursing through veins.`",
        LintKind::Eggcorn
    ),
});
```

As for the Rust code, it is often heinous and a chore to review.
I won't do myself the embarrassment of including it here.

## Introducing Weir

The heart of Weir is an expression language that mimics the pseudocode Harper contributors tend to use when describing the Rust code they intend to write.

Imagine you work at Google. You've just rebranded the "G Suite" collection of apps and services to the new name "Google Workspace".
Before that, they were collectively named "Google Apps for Work".
Moving forward, you don't want you or your coworkers to accidentally write "G Suite" on public documentation, because doing so might confuse users.
To solve this, you use the following Weir rule:

```weir
set main [(G [Suite, Suit]), (Google Apps for Work)]

declare message "Use the updated brand."
declare description "`G Suite` or `Google Apps for Work` is now called `Google Workspace`"
declare kind "Miscellaneous"
declare becomes "Google Workspace"
```

The first line describes the pattern of the problematic text.
There are two cases here:

1. The letter "G" followed by "Suite" or its misspelling "Suit"
1. The literal phrase "Google Apps for Work"

Here is a semantically equivalent example that I find a bit easier to read:

```weir
set main [(G Suite), (G Suit), (Google Apps for Work)]
```

The remaining lines describe:

1. The message to be shown to the user when the error in encountered.
1. A description of the rule itself, explaining why it exists.
1. What kind of rule it is. 
   I suspect most end users will mark it as "miscellaneous".
   I'm considering making this field optional.
1. What corrections to provide to the user.

One of my goals here was to make the system simple enough for an end-user to copy and paste an existing rule into a new file, make some tweaks, and they would be done.
For the more complex cases, I think we could set up a custom GPT to write these pretty easily.

Here's another example, one that will actually be a part of the Harper source code.
It uses a filter (the `<>` syntax) to first select the broader phrase, then another to select the whitespace in-between (that's the `( )` part).

```weir
set main <([right, middle, left] $click), ( )>
declare message "Hyphenate this mouse command"
declare description "Hyphenates right-click style mouse commands."
declare kind "Punctuation"
declare becomes "-"
```

This is a great example of the `$` tag. 
Instead of instructing Harper to look for the literal word afterwards, it instead instructs it to look for all derivative words.
Those include "click", "clicking", "clicked", etc.

We also have specific syntax that can be used to test the expression inline.
These assert that the left string, after being passed through the rule, becomes the right string.

```weir
test "Right click the icon." "Right-click the icon."
test "Please right click on the link." "Please right-click on the link."
test "They right clicked the submit button." "They right-clicked the submit button."
test "Right clicking the item highlights it." "Right-clicking the item highlights it."
test "Right clicks are tracked in the log." "Right-clicks are tracked in the log."
test "He RIGHT CLICKED the file." "He RIGHT-CLICKED the file."
test "Left click the checkbox." "Left-click the checkbox."
test "Middle click to open in a new tab." "Middle-click to open in a new tab."
```

I suspect Weir will make it extremely easy for AI agents to iterate quickly on these rules.
There's no compilation step, and we already have excellent pipelines for generating lists of test cases.

## Why Call It "Weir"?

I am naming Weir after the author of _Project Hail Mary_, [Andy Weir](https://en.wikipedia.org/wiki/Andy_Weir).
I guess I just like naming things after authors.
After all, Harper itself was [named after Harper Lee](./naming_harper.md).

## Moving Forward

Once the syntax is finalized and a corpus of tests have been written, I suspect Weir rules will become the default for new grammatical rules inside the Harper repository and for individual users.
I'd love to create a marketplace for rule sets created by and for the community.

If you (the reader) have any thoughts on syntax or anything else, don't hesitate to speak your mind.
