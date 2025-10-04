# Speeding Up My LLM Workflow

The biggest problem with AI programming today is not what I expected a few years ago.
I truly didn't believe they would be able to do any economically valuable work.

For web development, modern programming tools like [Codex](https://openai.com/codex/) are quite good.
They are able to understand a query and identify the relevant areas in a codebase.
Then, they can make modifications and iterate on the solution until it fits the prompt.
Frankly, I never expected them to reach this point.

No, the prevailing problem I've encountered with these tools is not their ability to do work.
Rather, the problem comes from their inability to ask questions up-front and iterate on their mental model before starting to code.

Here's what I mean.

## Some Context

[Harper's landing page](https://writewithharper.com) is pretty important.
It sets expectations for potential users with a working in-browser demo and reduces unproductive traffic to our issue-tracker by answering common questions.
In the past, improving the capital-"Q" Quality of our landing page has had a significant impact on Harper's growth rate.

## What Did I Do?

Earlier this week, I wanted to make some significant changes to parts of this landing page.
Since the complexity of this part of the code-base is relatively small, I wanted to try something: a new (to me) way to work with OpenAI's Codex.

Most of the marketing materials surrounding these tools imply that having a conversation with the "agent" is the intended workflow.
Sam Altman et al. make it seem like I'm supposed to boot up Codex and have a discussion.
At the end of that discussion, the thing in my head is down on paper (or code).

I wanted to try something new.
Instead of a conversation, I wrote a detailed goal document.
I usually wouldn't do such a thing for such a trivial task, but as I said: this was an experiment.

To parallel what real project doc would look like, I included what, why, and how the changes I wanted should be made.
Notably, I tried to anticipate any possible revisions or misinterpretations the agent might make, which I would later have to have a conversation about.
When I was done, I gave it to the agent and went to work on something else.
I came back an hour later, and it was done.

## What's the Big Deal?

Imagine this situation. It may sound familiar to you.

_You sit down to experiment with an LLM. You want to see what all hype around vibe-coding looks like._
_You tell the agent what you want. You wait a few minutes for it to do its thing. The result doesn't look right, so you prompt it once more. You wait some more. The cycle continues._

This is extraordinarily inefficient.
You're cosplaying as a micromanaging boss.

If I had done used the conversational micro-managing strategy when working on the landing page, it probably would have taken just as long (about an hour).
The downside, is that I don't get to go work on something else in the meantime.

By writing a planning document for your agent, you can give yourself room to breath, saving time and being more productive as a result.
