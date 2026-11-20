---
"description": "To allow Harper to do the most work possible in the time between when a user finished typing and when they're ready for review, I am introducing a new idea into Harper's core grammar checker: the __deadline__."
"pubDate": "Fri, 20 Nov 2026 22:31:22 GMT"
"keywords":
  - "Harper"
"image": null
"featured": false
"draft": false 
---

# Dealing with Deadlines

Harper will soon be doing more work on your device than it ever has before.
We are preparing to release a series of fantastic grammar checking models ([transformers](https://en.wikipedia.org/wiki/Generative_pre-trained_transformer), in fact) that will significantly enhance the kinds of things Harper can do for you.
These models are going to be quite helpful for every kind of writer, but they come with two major downsides:
They take time to run, and they consume up a lot of compute resources.

We want to be mindful of our user's computers, so we want to run these models _only_ when necessary and we want the process to avoid interrupting the user's flow.
To that end, I am slightly modifying how our various rules check your text.

In addition to our desire to avoid wasting CPU cycles, there's another problem.
We aim to offer the _best_ corrections possible in the time between each keystroke.
This allows authors to minimize the time between when they write text and when they may review our suggestions.
After all, Harper's ultimate goal is to bring editing time and energy to 0.
To achieve that, we need to be able to do as much analysis as possible in the time between when the user writes a passage and when they are ready to review it.

## Before The Deadline 

To allow Harper to do the most work possible in the time between when a user finished typing and when they're ready for review, I am introducing a new idea into Harper's core grammar checker: the __deadline__.
Here's how it works.

Harper will keep track of the _throughput_ of every grammar rule we check.
I will measure it in characters per second.
Whenever we check a user's document, Harper will keep track of exactly how much CPU time each rule consumes, then divide it by the document length.
If we do this many times with a variety of documents, we can get a rough estimate of how long _on average_ it takes a given rule to process and offer suggestions to improve or grammar check a single character

I call this process _calibration_.
An initial calibration process will need to run when Harper first starts up.
That will happen quickly in the background, so the user will not even noticed it happened.
After that, the throughput estimates will continue to get more accurate as the user uses Harper.

Once Harper has been calibrated, we can assign deadlines to specific rules based on when the user might expect them to be available.
Some things are most useful __while__ the user is actively typing.

For instance, I often already know if I have made a typo _before_ I even finish typing a word.
When that happens, I expect the spell checker to already be available to fix my problem.
With a quick tap of `Ctrl+e` I can fix it without even reading what the spell checker thinks the word is.
I trust it implicitly to be both fast and correct.
Rules like this will be given a very fast deadline, under 16 milliseconds.

Other types of suggestions, like full sentence or paragraph rewrites, are not as time sensitive.
I do not need to read through a suggestion to rewrite a sentence until _after_ I am actually finished writing the sentence.
Rules like these which need more time to process anyway will be given longer deadlines measured in seconds.

## Evolution

These deadlines are only a framework to communicate to Harper's core how long an operation is _allowed_ to take.
Fine tuning the specifics of what the deadlines should be is another, bigger problem.

I can imagine a future where we train a small neural network to infer these deadlines from past keystrokes, but we are not quite there yet.
To start, we will use very coarse estimations of what a "good" deadline looks like for various situations.
If the course deadlines turn out to work well enough, great! If not, we can always iterate until we attain perfection.

Of course, if any readers have any input on what a good deadline looks like, let me know!
