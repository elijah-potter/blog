---
"description": "I am trying to create a strong and small base model. A model that can semantically understand small passages of text, which we can then retrain to do a variety of different things."
"pubDate": "Fri, 04 Sep 2026 19:38:54 GMT"
"keywords":
  - "Harper"
  - "LLM"
  - "Small language models"
"image": null
"featured": false
"draft": false
---

# Bytes Are Not Big Enough

> I apologize for using some relatively technical terminology in today's post.
> In the interest of saving space on the page, I will not reiterate the definitions of "tokenization" nor the various methods of doing so.
> If you are already well-versed in the field, great! If not, I believe [this page gives a decent explanation.](https://en.wikipedia.org/wiki/Large_language_model#Tokenization)

I first set out to build [a small language model several months ago](./training_a_small_language_model).
While the original goal — to emit legible English by passing bare bytes into a transformer — was a success, I was left unsatisfied with the applicability of the model itself. To put it plainly: The model worked, but it was not useful for anything.
My long-term vision is to offer a "Pro" version of Harper that allows professionals in service industries to _rewrite_ their text quickly using an on-device small language model.

Since then, I have been distracted with several other important missions, including a Harper Desktop app for macOS and Windows. 

This week, however, I allowed myself some more time to work on it.

## The Problem

I am trying to create a strong and small base model.
A model that can semantically understand small passages of text, which we can then retrain to do a variety of different things.
If a small base model like this can be made, we could do a lot of other things using its intermediate representations:

- Rewrite sentences (from passive voice to active voice or from casual tone to formal tone).
- Infer where commas should be placed.
- Prioritize Harper's suggestions to better surface them for users.

The key here is that the model must be aware of both the intricacies of sub-word components (including individual affixes), but also be aware of higher-level details, like word order and tone.
My previous attempt was well-aware of the former (better than many larger models), but failed in tasks that required higher level grammatical reasoning.

However, we could not expand the tokens to be much larger without dramatically increasing the inference cost for the end user.
To accomplish what we aim to, this final model must be able to achieve triple-digit tokens per second on consumer-grade CPUs.
It must be very small and very fast.

## The Solution

In my experimentation this week, I found that I was right about one thing and wrong about another.

I was right that there is an ideal average token size for our workload.
I was wrong that it was a single byte.

As it turns out, the ideal token size for our tasks seem to be about 3.47 characters per token.
Big enough to allow the model to focus on the big picture tasks, but small enough for the model to have enough awareness of the structure of individual words.

> "Elijah, how did you calculate that average?"
> I ran a task using the model and averaged the size of the tokens emitted. 
> Obviously, it probably is not a super accurate figure, but I think it offers enough salience and precision for this post.

To scale up the token size, I used `riptoken` and I tested out a few off-the-shelf pretrained tokenizers.
I ended up using one with a vocabulary of about 8192 tokens.

Moving forward, I believe I need to up the model size just a tad, then work on better post-training.
