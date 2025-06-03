# Transformation-based Learning for POS Tagging

![CTLM](/images/ctlm.webp)

Harper is currently undergoing some pretty radical changes when it comes to its language analysis. These improvements will improve the output of our existing rule engine, in addition to making entirely new corrections possible. This post will cover our existing NLP pipeline, the recent changes and improvements to our machine learning approach, and what will come next.

While AI is a common topic of discussion online, I don’t hear much about actual machine learning. In that light, I hope this post piques someone’s interest.

## What is POS Tagging?

POS (Part-of-speech) tagging is the first step of most NLP pipelines. For any grammar checker worth its salt, POS tagging is essential. Apart from the basic corrections you’re capable of doing with simple string manipulation, most grammar checking directly or indirectly depends on POS tagging. High-quality tagging results in high-quality suggestions.

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

## Building the Model

I took a supervised learning approach here, making use of open-source datasets from organizations like Universal Dependencies. Since step one in any such endeavor is to obtain the data. Conveniently, these datasets include pretagged corpus’, which I ingested easily using `rs_conllu`.

Once that was done, I created a benchmark for Harper’s existing POS tagger. I found that it scored about a 40% accuracy when 100% certainty was required. When lower levels of certainty were needed, I found it performed a bit better. Either way, there was plenty of room for improvement.

Transformation-based learning is remarkably simple.

*   Provide a base pass over the data using a simple learning technique. In our case, we assign the most common POS tag for a given word from the corpus. “Tan”, for example, might be most frequently used as a verb, so we’ll start by tagging it as so.
*   Generate a list of “patch rules” for the data. In a nutshell, these are simple criterion paired with POS transitions. For example, each time we see a token marked as an adposition sandwiched between a noun and a verb, mark it as a subordinating conjunction instead.
*   Apply each of these patch rules over the base pass and check if the tagger’s performance improves. If so, add it to an ongoing list of “winners”.
*   Loop steps 2 and 3 until you reach a satisfying level of performance.

That’s the whole process! With it, I was able to bring our previous accuracy all the way up to 95% (from 40%) without a meaningful change in linting latency or compiled binary size.
