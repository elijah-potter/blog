# Updates on the Weir Language

In [my last blog post](./building_the_weir_language), I described the why, what, and how of the Weir programming language.
I suggest you read that first.

Before signing off for the day, I just wanted to give a few updates on the project.
For those interested in the technical side of things, I've opened [a draft PR](https://github.com/Automattic/harper/pull/2357) for your reading pleasure.

## Updated Keywords

After having a conversation with Jason Adams, I came to the realization that `declare` and `set` are pretty sh*tty keywords.
They aren't self-describing and you'd be hard-pressed to find any real programming language that uses them.

I've instead replaced them with `let` and `expr`.

Here's what the rule from my last blog post looks like with these updated keywords:

```weir
expr main [(G [Suite, Suit]), (Google Apps for Work)]
let message "Use the updated brand."
let description "`G Suite` or `Google Apps for Work` is now called `Google Workspace`"
let kind "Miscellaneous"
let becomes "Google Workspace"
let strategy "Exact"
```

Note that I've also added the `strategy` setting.
This allows rule authors to describe which strategy Harper will use when applying the replacements.
Right now, the only two options are `Exact` or `MatchCase`, which apply either the exact text, or the exact text but matching the capitalization of the text it replaces.
In the above example, we use `Exact` because it is a proper noun, and it doesn't matter what the original text looked like: we want to capitalize it properly.

## Deprecation of the `phrase_corrections` Module

I've also gone ahead and converted the entirety of the `phrase_corrections` module, as well as all associated tests, to the Weir language.
If you're reading this and you're a contributor, know that we will no longer be adding new rules to that module once Weir is merged into `master`.
When the merge happens, I'll handle the conversion of any lagging phrase corrections that haven't already been converted.

That unfortunately means that [my previous guide](./writing_a_phrase_correction_for_harper) on the subject is no longer relevant.

## What's Next?

Before Weir gets merged, I plan to support the matching of UPOS tags, in additional to some other quality of life updates.
Expect another blog post.

In the meantime, please let me know if you have any additional input!
