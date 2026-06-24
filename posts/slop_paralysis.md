---
"description": "A complete or partial loss of function while reviewing the output of a coding agent."
"pubDate": "Wed, 24 Jun 2026 16:41:44 GMT"
"keywords":
  - "keyword"
"image": null
"featured": false
"draft": false
---

# Slop Paralysis

> __slop paralysis - noun__
>
> A complete or partial loss of function while reviewing the output of a coding agent. 

Let me paint you a picture.

You have an idea for product.
It could be anything: A mobile app, a dashboard, or a script to automate your work.
So, you sit down with your favorite LLM and describe your idea. 
Maybe you have a pretty good understanding of how it should be implemented.
You might even know the overall structure of the project in your mind.
You tell your coding agent all of this.

Then, you let it loose.
It cooks and cleans and implements your product for you.
In the end, you have _some_ idea of how the end result works, but it is not complete.
Since this is a project that is imporetant, which you intend to maintain, you go to read the code.
That's when it hits you.
__Slop paralysis__.

## The Problem

Slop paralysis is the complete lack of desire to review the output of an LLM.
It could show up for any number of reasons.
The most common, for me, are:

- The sheer amount of code demanding consumption.
- Missing context (that the agent was aware of, but not you).
- A fear of breaking something.

In the end, slop paralysis slows you down and makes your life more stressful.
So, what can we do about it?

## Some Solutions

I will describe some solutions that have worked _for me_.
As always, your mileage may vary.

The obvious solution is to simply not use an agent.
Sometimes coding agents make your job easier.
Sometimes they do not.
[Knowing which is which is difficult, but extremely valuable.](./when_to_use_an_agent)

When you do decide to use an agent, you can have the agent simply produce less code.
I've heard of [projects](https://github.com/DietrichGebert/ponytail) that help you do this, but I haven't actually tried them.
Instead, I ask the agent to make a plan first, then rework that plan myself to minimize the number of changes.
In the end, a plan which was originally written by the agent becomes one that has been mercilessly edited by myself.
In this way, I minimize the amount of code which demands consumption.
The side-effect of this is that I then have an excellent understanding of what the agent actually does, which helps with the context problem.

The final strategy, which I use when all else fails, is to refactor the code by hand.
When the agent has proven the technical feasibility of the project, but the code is simply too expansive to properly grok all at once, I sit down with a fine-tooth comb and refactor it, module by module.
I do not need to carefully read each function and evaluate its merits, but I do force myself to, at minimum, lay eyes on them all.

## Stay Steady Out There

I find myself becoming more overwhelmed by the discourse every single day.
It's exhausting how much is happening in the world, and even worst, how much you are expected to care about it all.
Take some time for yourself.
Save yourself from slop paralysis.
