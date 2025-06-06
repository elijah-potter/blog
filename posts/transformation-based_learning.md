# Transformation-based Learning for POS Tagging

![CTLM](/images/ctlm.webp)

[Harper](https://writewithharper.com/) is currently undergoing some pretty radical changes when it comes to its language analysis. These improvements will improve the output of our existing rule engine, in addition to making entirely new corrections possible. This post will cover our existing NLP pipeline, the recent changes and improvements to our machine learning approach, and what will come next.

While AI is a common topic of discussion online, I don’t hear much about actual machine learning. In that light, I hope this post piques someone’s interest.

## What is POS Tagging?

POS (Part-of-speech) tagging is the first step of most NLP (Natural Language Processing) pipelines. For any grammar checker worth its salt, POS tagging is essential. Apart from the basic corrections you’re capable of doing with simple string manipulation, most grammar checking directly or indirectly depends on POS tagging. High-quality tagging results in high-quality suggestions.

What is POS tagging? It is the process of identifying which possible definition of a word is being used, based on the surrounding context. For those unfamiliar with the territory, I’m certain an example is the best way to explain.

> “I am going to go tan in the sun.”

Here we have a simple, English sentence. In this case, it is clear the word “tan” is being used as verb. The linguists in the audience would point out that it is specifically in the first-person future tense. Consider this similar sentence:

> “I am already very tan, so I will stay inside.”

In this sentence, the word “tan” is being used as an adjective. How can we tell?

As intelligent humans, some of whom have been speaking English their entire lives, it is easy for us to determine which words are serving which roles. It’s not as easy for a computer to do the same. From an algorithmic standpoint, there are a number of ways to go about it, each with differing levels of “machine learning” required.

Before this week, Harper primarily took a dictionary-based approach. In short: we ship a “dictionary” of English words to the user’s machine and use hash table lookups to determine the possible roles each word could assume. The authors to our rule engine could then use rudimentary deductive reasoning to narrow the possibilities down. This strategy is remarkably effective and it has scaled to tens of thousands of users with surprisingly few hiccups.

That said, there are edge-cases and systems (which I’ll cover next week when I discuss chunking) which require extreme specificity from POS tags. My mission: improve our POS tagging to increase the confidence of Harper’s output and open the door for more advanced algorithms.

## Why Transformation-based Learning?

The literature highlights three underling machine learning model strategies that seem to work well for POS tagging.

*   Hidden Markov Models (which are traditionally deep neural networks)
*   Maximum Entropy Models (which are traditionally shallow neural networks)
*   Transformation-based Rule Models (which are based on learned rules)

While I heavily considered using a neural network (either via an HMM or MEM), I discarded the technology for three reasons.

*   TRMs are typically more accurate (barely; measured in basis points).
*   TRMs are more amenable to fine-tuning.
*   TRMs are exceptionally low-latency and can be compressed quite small.

Transformation-based learning is remarkably simple. It boils down to just four steps:

- Use a simple, stochastic model to label your data. This can be as simple as tagging each token (or other discrete component) with that variant’s most common tag. It doesn’t need to super accurate, just enough to establish a baseline.
- Identify the errors between the tags in your canonical data and that which produced by your baseline model.
- Using a finite list of human-defined templates, generate candidate rules that transform the output of the baseline model into something else. This is where the term “transformation-based” comes from.
- Apply each of the candidate rules to the baseline model’s output. Check if the result is _more_ accurate than before. If so, save the rule for future use.

These saved candidates become your model.

## POS-Tagging using Transformation-based Learning

Let’s apply these steps to build a POS-tagging system.

For our baseline model, we will just assign each word in our dataset the most common POS tag associated with that word. If the word is “tan”, we’ll assign it’s most common POS tag (verb). It will often be incorrect, but those cases will be handled by our rules.

To identify the baseline model’s errors, we’ll use an off-the-shelf tree-bank from the Universal Dependencies project.

Our rule templates will take the form of these `PatchCriteria`. By initializing our candidates with any one of these enum variants and initializing the child variables to random values, we can cover a good number of cases.

```rust
#[derive(Debug, Clone, Serialize, Deserialize, Hash, PartialEq, Eq)]
pub enum PatchCriteria {
    WordIsTaggedWith {
        /// Which token to inspect.
        relative: isize,
        is_tagged: UPOS,
    },
    AnyWordIsTaggedWith {
        /// The farthest relative index to look
        max_relative: isize,
        is_tagged: UPOS,
    },
    SandwichTaggedWith {
        prev_word_tagged: UPOS,
        post_word_tagged: UPOS,
    },
    WordIs {
        relative: isize,
        word: String,
    },
    /// Not applicable to the Brill Tagger, only the chunker
    NounPhraseAt {
        is_np: bool,
        relative: isize,
    },
    Combined {
        a: Box<PatchCriteria>,
        b: Box<PatchCriteria>,
    },
}
```

Finally, we’ll apply each of the hundreds of thousands of candidates to our treebank to see if the result of their transformations have a lower error rate than the baseline.

Here are a couple of the candidates we found:

```json
[
  {
    "from": "PRON",
    "to": "SCONJ",
    "criteria": {
      "Combined": {
        "a": {
          "WordIs": {
            "relative": 0,
            "word": "that"
          }
        },
        "b": {
          "WordIsTaggedWith": {
            "relative": -1,
            "is_tagged": "VERB"
          }
        }
      }
    }
  },
  {
    "from": "PART",
    "to": "ADP",
    "criteria": {
      "Combined": {
        "a": {
          "WordIs": {
            "relative": 1,
            "word": "there"
          }
        },
        "b": {
          "AnyWordIsTaggedWith": {
            "max_relative": -4,
            "is_tagged": "NOUN"
          }
        }
      }
    }
  }
]
```

That’s the whole process! With it, I was able to bring our previous accuracy all the way up to 95% (from 40%) without a meaningful change in linting latency or compiled binary size.
