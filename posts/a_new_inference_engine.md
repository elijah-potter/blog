---
"description": "For the past few months, I've been dedicating enormous swaths of my time to training a small language model, working from basic principles. The goal is to provide a complete overhaul of how Harper does its grammar checking."
"pubDate": "Fri, 23 Oct 2026 19:57:39 GMT"
"keywords":
  - "Harper"
  - "LLM"
  - "Inference"
  - "Andrew"
"image": null
"featured": false
"draft": false 
---

# A New Inference Engine

For the past few months, I've been dedicating enormous swaths of my time to training a small language model, working from basic principles.
The goal is to provide a complete overhaul of how Harper does its grammar checking.

In my first blog post about the subject, I detailed some hypothetical ideas for how we would implement this change, but I didn't want to be too prescriptivist, so I didn't say anything concrete.
Now that some time has passed and I've earned a better understanding of the problem domain, I'm ready to share my vision.

I'm writing this out publicly for a new reasons:

- I see to document the decision making process behind Harper's architecture, so as to help new contributors understand how Harper works.
- Harper is designed to be extensible. Some of the models that we (Automattic) train will remain proprietary, but if someone in the community wishes to train their own for their own purposes (i.e., to support a language we do not), they should be able to do so.

## The Constraints

There are a number of inference engines that already exist.
Why don't we use or repurpose one of those for Harper?
In short: none of them work under the constraints Harper is under.

### Harper Runs On-Device

Most off-the-shelf inference engines are designed for datacenter use.
That's fine — if you run your models on specialized hardware.
Harper needs to run on any kind of device, from the latest high-end MacBooks to ten year old ThinkPads.
Not only that, but it needs to sip power.
Our inference engine needs to be able to slow itself down (to sip power in the background for noncritical queries) and speed itself up when the user demands Harper's immediate attention.

### Not All Our Models Work on Most Inference Engines

Harper will make use of an autoregressive transformer model for sentence rewriting (more on that later), but that is not the only kind of model we will need.
We will also be providing models that perform character masking.
What does that mean?

Instead of doing autoregressive inference (which can require thousands of separate forward passes through a model to produce a single output), masking models do a single forward pass.
They provide character-level "masks" that we can use for another part of our grammar pipeline.
For example, we could have a model (coupled with a LoRa, which we will talk about in a minute) perform a single masking pass over a user's entire document, producing a list of locations they should have inserted commas.
From there, Harper can highlight those locations and offer to insert the relevant punctuation.

An autoregressive model would have taken several minutes to do this kind of analysis on consumer hardware.
We can do it in fractions of a second.

### Harper Runs _Everywhere_

On top of those two already difficult constraints, Harper also needs to run anywhere.
We run natively on laptops via Harper Desktop, but we also run our engine in the service worker of browsers in WebAssembly.
Whichever inference engine we use must be able to run in all those places, using the best available accelerators.

### LoRA Swap Speed Is Important

Different kinds of linting tasks may need different behavior from the same model.
To accomplish that while keeping model size tiny, we will NOT be training any model for instruction following.
Instead, we will be dynamically loading and unloading LoRAs from the model for multiple inference passes over the user's document.
One pass might analyze punctuation, another might analyze tone.
To do this, we need to be able to swap between multiple LoRAs on the same model several times per second.

It's not that most inference engines can't do this, but their interfaces make it kludgey.

## Andrew

Harper's new inference engine, which I am tentatively naming ["Andrew"](https://en.wikipedia.org/wiki/Bicentennial_Man_(film)), currently resides in its own repository.
Soon, it will enter Harper's monorepo.
It's based on [Burn](https://burn.dev/), a Rust library for doing ML work anywhere.

Andrew fulfills all our requirements:

- It can run anywhere (as you will soon see).
- It can load, unload, and switch LoRAs instantly.
- Base model weights can be composed (like LEGO) to use the same weights when switching between batched masking and autoregressive inference.
- It is optimized for consumer hardware.
