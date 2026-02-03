# Training a Small Language Model

> TL;DR: I've built and trained an extremely small language model from scratch, specifically designed for short-form sentence rewriting tasks that are highly resource constrained.

In [my last post](./finding_the_active_voice), I discussed how I plan to tackle the difficult problem of helping [Harper's](https://writewithharper.com) users take advantage of the active voice.
The active voice is seen as more confident and authoritative, which is often desired in professions like customer service.
I have experience in that area, which is how I know the extent to which help with the active voice can make the job easier.

Naturally, we would only want to provide help with the active voice when specifically requested by the user. 
That means it's an opt-in feature that isn't enabled by default.
If we succeed in implementing the functionality, and people seem to like it, the Harper project can reconsider this stance. 
For now, the plan is for it to be disabled by default.

As I iterated in my last post, the state-of-the-art method for converting from the passive voice to the active voice is to use an autoregressive transformer model.
This is the same fundamental technology behind apps like Google Translate and ChatGPT.
While the actual model I intend use for this feature is similar in nature to those used in these apps, my implementation will be entirely different in scale.

You see, since our domain is so limited in scope, we can use an extremely small model.
Google's smallest T5 model is a great point of reference.
A quantized copy of that model runs about 60 megabytes.
I believe we can train our own transformer model from scratch and pack it in an unquantized container measuring no larger than 30 megabytes.

Why do I believe this to be possible?
Because I've done it.

## Our Model Architecture

Over the past few days, I've implemented a basic language model in Rust using Burn.
For the curious, the code is [open source](https://github.com/elijah-potter/lm).
It's pretty messy, so please don't look at the commit history.
Once I have a solid proof-of-concept working, I'll polish it up and find a good home for it in the main Harper repository.

The key here is that our use-case only needs a few hundred characters of context.
Since the computational cost of an LLM can be approximated as the square of the context size, we can train highly effective models ourselves that are small and can run anywhere.
If we want to provide additional information to the model, such as style or domain, we can supplement this context with custom embeddings. 

Using a small model allows us to maintain our privacy guarantees without significant capital expense.
In fact, once we've trained the models, they're free to run indefinitely.

I've chosen to use a character-level tokenizer.
That means that each character is its own token, and the context size of the model is equivalent to the number of characters it can read at once.
The hope here is that it allow us to minimize Harper's final binary size and give the model greater freedom to change the inflection of words however it pleases.

For now, here are some simple sentences generated with the basic model I trained for just under an hour.
It's pretty amazing what can be done with just under a dollar's worth of computing power.

```plaintext
The forest rested in a speed of the night.
```

Feels... introspective, no?

```plaintext
It was the today of the world.
```

## Moving Forward

My focus this week was to get a basic autoregressive model trained on generic English text.
My focus starting next week will be to fine-tune this model for our sentence rewriting task.
Once we have a very solid base model, I see no reason we couldn't fine-tune similar models for other features, like changing tone or improving clarity.

My current implementation, while fast, could also use some improvement. 
To that end, I'd also like to implement a KV cache.
That will allow us to scale up to larger context sizes without a drop in quality or speed.

P.S. Today is my birthday! I'm so grateful for the years I've been on this earth, and I can't wait for more. Thanks for reading! Here's to 21.
