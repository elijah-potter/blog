# Training a Chunker with Burn

![Graffiti in an Underpass](/images/underpass.webp)

In a previous post, I detailed how I implemented a basic nominal phrase chunker using Transformation-based learning.
Since then, I've taken another crack at the problem.
My main goal: improve the accuracy.
The end result is a portable neural network model that achieves ~95% accuracy on grammatically correct text.

## The Failures of the Brill Chunker

The Brill Chunker was, by many accounts, a success.
It wasn't, however, a success in the main way that mattered: It wasn't reliable enough to be used in Harper's grammatical rule system.
While fast and small, it failed to catch most edge-cases in English text.
In some senses, it overfit its training dataset.

## Our Goal

We want Harper to be able to match against subjects and objects in sentences.
This is a prerequisite for checking a diverse array of grammatical rules.
For example, to catch the error in this sentence, we need to correctly identify which tokens represent our subject.

```
Neither of the big blue bottle would be broken by the fall.
```

In this case, our user has accidentally made the subject singular, while the verb "neither" implies that the subject should be plural.
We call this an agreement error.
Because our subject, "big blue bottle" contains multiple tokens, we need a way to identify subjects at a higher level than per-token.
That is what a chunker does.

## Why Train Our Own?

As our needs continue to expand alongside our user-base, I need the chunker to be flexible.
If its needed capabilities expand, I need to be able to retrain the model to meet them.
That would not be possible without having a deep understanding of how the system works.

## Building a Neural Net

To build a new chunker, I just needed to implement the Harper `Chunker` trait.
Easy enough.

```rust
/// An implementer of this trait is capable of identifying the noun phrases in a provided sentence.
pub trait Chunker {
    /// Iterate over the sentence, identifying the noun phrases contained within.
    /// A token marked `true` is a component of a noun phrase.
    /// A token marked `false` is not.
    fn chunk_sentence(&self, sentence: &[String], tags: &[Option<UPOS>]) -> Vec<bool>;
}
```

For the nerds in the crowd, I decided to use a `Word + POS embedding -> BiLSTM -> Linear` architecture.
To keep things portable and consistent with the rest of the Harper codebase, I used [Burn](https://burn.dev/), a Rust-native machine learning toolkit.
While I believe the BiLSTM to be good enough for this application, one advantage of Burn is the ability to easily swap it out for a transformer if the need arises.
It also makes it unbelievably easy to quantize models.

This architecture gives us some hyperparameters to tune against.
After dozens of training runs of experimentation, these worked best:

| Dropout probability | Embedding dimensions | Learning rate (I used Adam) | Dataset |
| -: | - | -: | - |
| 30% | 16 Word Embeddings + 8 UPOS Embeddings | 0.003 | GUM + EWT + LINES |

## What's Next?

Similar to the Brill Chunker, I'll be trying to use this new system in our grammar checker.
From there, I'll know what additional information we'd like for it to infer.
Once I've gotten it to reliably work for >= 3 rules, I'll declare it ready to merge.
