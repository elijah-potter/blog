# Continuations on Transformation-based Learning

![Steps near Clear Creek. Taken by me.](/images/clear_creek_steps.webp)

The most common type of machine learning out there takes the form of some kind of neural network. Inspired by how our own brains work, these systems act as function approximations. They are great, but they come with a few key pitfalls.

First and foremost, they start out with very little baked-in understanding of the context they live in. This is fine—usually enough data can be provided to bridge the gap. It does mean, however, that they spend an inordinate amount of time learning the fundamentals of their field. This translates to a larger model size and longer inference time (especially at [the edge](https://en.wikipedia.org/wiki/Edge_computing)).

Secondly, most neural networks are initialized with randomness, which results in extremely high entropy. High entropy means that these models cannot be compressed easily (if at all).

This disqualifies neural networks from many aspects of [Harper's architecture](https://writewithharper.com/). Harper tries to be fast and small, so it can be shipped and run wherever our users are. Neural networks (especially in the world of natural language processing) are neither fast nor small.

This is why we've taking an alternative approach to machine learning, as evidenced by last week's post on [transformation-based learning](https://elijahpotter.dev/articles/transformation-based_learning).

## Transformation-Based Learning: A Refresher

Transformation-based learning is remarkably simple. It boils down to just four steps:

- Use a simple, stochastic model t label your data. This can be as simple as tagging each token (or other discrete component) with that variant’s most common tag. It doesn’t need to super accurate, just enough to establish a baseline.
- Identify the errors between the tags in your canonical data and that which produced by your baseline model.
- Using a finite list of human-defined templates, generate candidate rules that transform the output of the baseline model into something else. This is where the term “transformation-based” comes from.
- Apply each of the candidate rules to the baseline model’s output. Check if the result is more accurate than before. If so, save the rule for future use.

These saved candidates become your model.

If you're interested how this could be applied to POS tagging, I've since updated my original post on the subject to better explain the process. I'd recommend taking a look.

## Nominal Phrase Chunking

It's often useful, especially when building a grammar checker, to be able to identify the subjects and objects of sentences. Suppose, for example, that we want to insert the missing Oxford comma in a list of fruits: "I like apples, bananas and oranges". In this trivial example, this can be done with POS tagging. If we have more complex subjects, like in the phrase "I like green apples, deliciously pernicious bananas and fresh oranges," POS tagging starts to fall apart. Identifying multi-token subjects is the job of a nominal phrase chunker.

I've been wanting to build a nominal phrase chunker for a while, but haven't had the tools to do so. Now that I have pipeline in place (from last week), it should be relatively straightforward.

For the purposes of this model, we'll be tagging each token with a boolean; it is either a member of a noun phrase, or it is not.

I started by assigning each token to a nominal phrase if a POS tagger marks it as a noun. This is our baseline model. It performs poorly because the resulting nominal phrases do not include determiners or any adjectives.

Similar to our POS tagging model, I used a Universal Dependencies treebank to determine the accuracy of our baseline. After generating candidate rules using the same patch templates as the POS tagging system and running them against the treebank, I have a model with a 90% accuracy. 

I feel as though there should be more details to share, but that was pretty much it. I spent a good amount of time optimizing the training code. There's still a lot of work left to do to incorporate it into the rest of Harper. I am also unsatisfied with the model's current accuracy. To get it closer to 100%, I suspect I'll need to do a good amount of data cleaning.
