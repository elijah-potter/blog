# When (Not) to Use an Agent 

There are times where it is prudent to use an AI agent (like Codex) aggressively. There are other times where they should be avoided like the plague. The question of into which bucket a particular endeavor falls is difficult to answer.
Anyone who says you should _always_ or _never_ use an LLM is oversimplifying the problem.

Naturally, anything prescriptivist related to LLMs online should be regarded with a fair amount of skepticism.
That includes what I have to say.

## There Is a Difference

AI agents can be enormously helpful.
The key word is "can". 
It is not always a guarantee.

Indeed, most developers say that they estimate their productivity multiple to be greater than one when surveyed.
In other words, they think that their productivity at least doubles when they use either Claude Code or Codex.
In reality, they agents can often slow you down, even if it feels like they are helping.
Indeed, [an METR study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) found that they more frequently counterproductive than productive, even if the developer feels otherwise.

Over the last few months, I have been anecdotally tracking the types of tasks that I've found to be empirically better done with an agent, and the types of tasks that are better done with only the meat between my ears.
I've instilled that experience down to a set of principles which, I believe, can be employed to save any software engineer a decent amount of time.
This post includes a few of those principles.

## Your Mileage May Vary
Before we get to those principles, however, I would like to make my reality clear to those reading.
I work on highly-technical integrated systems that involve a high level of knowledge.
Making spurious modifications to these systems can have outcomes that are difficult to predict without a good mental model of how they work.

That means many bugs can be solved in just a few lines of code, and many features can be implemented by simply connecting two seemingly unrelated systems in a strategic way.

My experience may not match yours, especially if you work on systems more loosely integrated.

## Err on the Side of Agent-Free Development

> "Back in my day, we would have just called it 'development'." - Me, after writing the above heading.

If you cannot articulate why an agent would be better or faster at completing a task, it is probably because you should do it by hand.

In the early days of my explorations into ChatGPT, and later into Codex, I found myself reaching for the shiny new tool every chance I could.
It became a habit.
I would sit down at my laptop, decide what I wanted to work on, and the next thing I knew I would be typing a prompt into one LLM or another.

> "I see why it’s easy to fall in love with these things, because the variable positive reinforcement slot machine cowboy hacking is honestly more fun than if it had just gotten it right on the first try." - [Matt Mullenweg](https://ma.tt/2026/02/claude-sonos/)

Honestly, it doesn't matter how these habits are built and then reinforced. 
What matters is how turning use of Codex or Claude Code into a habit results in a lot of wasted time.

Sure, sometimes the agent _will_ get it right on the first try.
The problem is that if it fails, you often need to start from scratch in order to end up with a product that's workable.
I have found myself spending hours refining prompts and going back-and-forth with an agent, only to throw it all out and code a better solution myself in less than fifteen minutes.

The critical piece here is that if you roll the dice, the potential for lost time is infinite while the potential for time saved is finite and often quantifiable.

So, if you cannot precisely articulate why you believe an agent will be able to do the job in less time than if you did the job yourself, you should attack the problem without one.
At least at first.

## Use an Agent for Large Refactors 

There will always be times where the dedicated tooling for your programming language of choice isn't enough.

I have encountered situations where I have needed to convert an interface into a class and cases where I needed to change a statically dispatched system into a dynamically dispatched one.
These are the kinds of problems that are great for agents to handle, because the logic is simple to verify and most of the changes are merely syntactic.

At the time, the dedicated Rust and C++ tooling at my disposal was not capable of doing such things.
When I threw an agent at the problem, it was more than capable of making the changes and verifying that they do what I want.
In fact, I suspect it made the exact edits that I would have made. 
At the very least, I was saved some typing.

Put another way, if the bulk of the problem is ["busywork"](https://en.wikipedia.org/wiki/Busy_work), let an agent handle it so you can focus on the more complex issues remaining.

## Core Systems Should Not Be Written by an Agent 

Systems core to a piece of software have two key requirements that, at the time of writing, cannot be fulfilled by any agents on the market.
They need to:

1. Be Flexible.
2. Aggressively modeled to the domain.

Flexibility means that the system can be extended or modified without much effort.
That it can be imagined as a whole by yourself and any future contributors, and semantic changes to minor components are unlikely to unexpectedly affect other minor components. 
Right now, no agents are capable of doing this. Trust me — I've tested them.

Similarly, core system architecture needs to fit the domain or problem it seeks to solve.
Otherwise, it will take undue effort to implement the smallest bit of functionality. 
Just like the indescribable quality of flexibility, this trait too is not represented by the code generated by agents on the market.
Their solutions are either too general or too direct.
In either case, the code turns out to be far from extensible.

## Extensions Are Perfect for Agents

While core systems should be architected with human muscle, extensions to that system can be built with agents.

Extensions are usually smaller in scope, restricted in capability by their environment, and are less likely to affect other systems.
That means they are generally easier to review, less likely to introduce security vulnerabilities, and creating them doesn't require an in-depth mental model.

This is why software like [Telex](https://telex.automattic.ai/) is so effective.
It is also why those who work with vertically integrated systems are likelier to run into issues when using agents than with horizontally integrated systems.

## What Is Your Experience?

I'm still learning how and when to integrate agents into my work, as is everyone else.
I'm curious: have you found specific kinds of issues or bugs that are best tackled with an agent?
Are there specific moments where you feel more productive _without_ one?
I am certain there are nuances I've missed here. 
What are they?
