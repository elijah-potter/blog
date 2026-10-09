---
"description": "Almost all the discourse around LLMs today is centered on the models themselves. Today, I want to introduce you to an entirely new world."
"pubDate": "Fri, 09 Oct 2026 18:31:19 GMT"
"keywords":
  - "LLMs"
  - "Sampling"
"image": null
"featured": false
"draft": false
---

# A Simple Overview of LLM Sampling Methods

Almost all the discourse around LLMs today is centered on the models themselves.
This model is better than that model which is better than this other model.
It's… exhausting.
It's also barely scratching the surface of what makes an effective LLM-based system.

Today, I want to introduce you to an entirely new world.
The world of sampling algorithms.
We'll discuss what they are, how some of them work, and the impact they can have on system performance.

## What Is a Sampling Algorithm?

If you've received even a simple explanation of how autoregressive language models work, you likely already have an intuitive understanding of what a sampling algorithm is.
If you have not, do not worry. It is not actually as complex as it sounds.

When you give an LLM a piece of text, it doesn't actually spit out more text.
The act of "writing" associated with LLMs when used in chatbots or elsewhere comes from a higher order program that simply _uses_ an LLM.
The LLM itself is only capable of spitting out a probability distribution.

What distribution might that be?
Given a sequence of words, an LLM emits the probability distribution of what word might come next.

> [I talk about this in more depth in my blog post about Markov Chains.](./markov_chains_are_the_original_language_models)

For example, let's say we offer an LLM the phrase, "The cat sat on the ".
In return, the LLM will give us a probability distribution over all the possible words that might come next.

| Word | Probability |
| :- | -: |
| hat | 0.9 |
| bat | 0.05 |
| radiator | 0.04 |
| … | 0.01 |

In order to generate text, all we need to do is choose among these possible words and append it to our input.
From there, we may repeat the cycle all over again.
If we do this enough times, we can get coherent-sounding prose from the model.

Here's the hard part: How we do choose a word from the probability distribution?
The answer: Use a sampling algorithm.

## Greedy Sampling.

Greedy sampling is the most obvious solution.
Given a probability distribution, a greedy sampling algorithm will simply choose the most likely word every time.

In our "The cat sat on the " example, our greedy algorithm would choose the most probable word, "hat".
It's simple, elegant, and it can sometimes get the job done.
But, as you may have guessed, it is not optimal.

The most obvious problem with greedy sampling appears as soon as you generate a meaningful amount of text.
It's filled with repetitions.

When I ask a small language model like `SmolLM2:135M` about Python, I get:

> Python is a great language for beginners, as it's easy to learn
> and has a large community of users. However, it's worth noting
> that Python can be challenging to learn, especially for those
> without prior experience with programming. But with the right
> resources and a solid foundation, Python can be a powerful tool
> for anyone looking to develop innovative solutions.
> 
> Some of the key features of Python include:
>
> * **Python 3.x**: Python 3.x is the latest version of Python,
> which is widely used in the industry.
> * **Standard Library**: Python has a large standard library that
> includes a wide range of tools and functions for various tasks.
> * **Extensive Object-Oriented Programming (OOP)**: Python has a
> strong focus on OOP, making it suitable for building complex
> applications and systems.
> * **Cross-Platform**: Python can run on multiple platforms,
> including Windows, macOS, Linux, and Android.
> * **Cross-Platform**: Python can run on multiple platforms,
> including Windows, macOS, Linux, and Android.

Notice anything?

Most obviously, it repeats itself unnecessarily.
It mentions "Cross-Platform" twice, with the same description text.
It's only a minor annoyance here, but repetition like this can be devastating for long-context reasoning models.
Using a sampling algorithm that is "too greedy" is a common reason for "looping" behavior in off-the-shelf reasoning models when they are set up incorrectly.

Additionally, the model finds itself too adherent to its own training data.
Notice how it lists "Python 3.x" as a "feature" of the language?
This is because that particular Python version number appears frequently in the data.
That means it can get ranked at the top of the probability distribution, even if it has nothing to do with the surrounding context.

Okay, how can we fix these problems?

## Statistical Sampling

The second most obvious sampling method is to sample from the probability distribution randomly.
Let's pull up that distribution from earlier:

| Word | Probability |
| :- | -: |
| hat | 0.9 |
| bat | 0.05 |
| radiator | 0.04 |
| … | 0.01 |

Our model suggests that the first word, "hat" is 18 times more likely to be the next word.
In statistical sampling, we honor that.
Instead of only sampling the most likely word like in greedy sampling, in statistical sampling we sample randomly, biasing ourselves to sample the more likely words more often.

The simplest algorithm to accomplish this is to:

1. Generate a random number $r$ between 0 and 1.
2. Iterate through the probability distribution $p_i$, starting with the most probable word first.
3. Once we encounter a word $p_x$ such that $\sum_{n = 1}^{x} p_n >= r$, we sample it.

In practice, this leads to more varied text.
The model no longer _needs_ to stick to the most likely word.
Instead, we can occasionally dip down and emit the less likely (potentially more interesting) words.

In reasoning models, this allows the model to explore more creative solutions to problems.
Statistical sampling (and the variants we explore below) also mitigate the repetition we saw in the greedy algorithm.

One of the problems with statistic sampling is that the randomness can occasionally produce words that are entirely unrelated to the topic at hand. 

By using a rather aggressive statistical sampler with the same model as before, we get something that seems fine at first, but degrades rather quickly.

> Python is an interpreted, dynamically-typed programming language
> created by Guido van Rossum. Its core features include syntax
> for compact readable code, ease of use with vast libraries and
> modules, good performance, ease of development with convenient
> development environments, user-friendly GUI, seamless
> interactions with online services, secure web coding, and
> databases for seamless business productivity applications.
> 
>  What other factors distinguishes python besides simple grammar
> have been utilized to interact with issues such as scheduling
> failure request for your machine service in just seconds because
> the load following how the role of domain guys emaild Osea.. I
> Hate syntax hard w

Programs that use LLMs with statistical samplers degrade at longer context sizes partly for this reason. 
Over time, the error in the randomness builds until the model can no longer produce logical text.

How can we mitigate this new problem?

## Nucleus Sampling

Nucleus sampling is just like statistical sampling, but with a defined limit to how unlikely a word is allowed to be.

To illustrate the process, let's set a limit (0.95) and go through each step.

| Word | Probability |
| :- | -: |
| hat | 0.9 |
| bat | 0.05 |
| radiator | 0.04 |
| … | 0.01 |

Before we can do anything, we need to produce our "nucleus".
To do this, we step through each item in our probability distribution.
While doing so, we keep track of the cumulative probability, just like in statistical sampling.
If we encounter any words whose cumulative probability is greater than our limit (that is, $\sum_{n = 1}^{x} p_n > 0.95$) we discard it.

After that, we are left with a new list of "probabilities":

| Word | Probability |
| :- | -: |
| hat | 0.9 |
| bat | 0.05 |

Except, these are not _quite_ probabilities. After all, the do not add up to 1.0.
Let's fix that by applying a softmax to the collection. I will not go into great detail of how that works. To put it simply, a softmax turns a collection of numbers into a proper probability distribution that sums to 1.0.

| Word | Probability |
| :- | -: |
| hat | 0.7 |
| bat | 0.3 |

From here, we just apply normal statistical sampling to our new probability distribution.

To sum it up, nucleus sampling the same as statistic sampling, but we remove all the most unlikely words from the distribution first.

Nucleus sampling mitigates all the downsides of the first two algorithms, while remaining performant.
Text is generally free of unnecessary repetition, and it avoids the random insertion of low-probability words.

# Conclusion

There are a few more salient sampling algorithms that perhaps should be included in today's post, like DRY sampling, but unfortunately I am out of time.
I've covered the more common ones today.
Most commercial apps use nucleus sampling. 
Some more niche apps use a kind of greedy sampling.
Knowing which to use is an important decision.
Make it wisely.
