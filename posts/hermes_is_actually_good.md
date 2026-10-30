---
"description": "For a long time now, I have been skeptical of tools like Hermes and OpenClaw. There are some good reasons for that, and some dumb reasons."
"pubDate": "Fri, 30 Oct 2026 20:15:57 GMT"
"keywords":
  - "Hermes"
  - "AI"
  - "LLMs"
"image": null
"featured": false
"draft": false
---

# Hermes Is Actually Good?

For a long time now, I have been skeptical of tools like Hermes and OpenClaw.
There are some good reasons for that, and some dumb reasons.

In January of this year, my newsfeed was flooded with discussion of OpenClaw.
It was the first publicly available model harness that claimed to be truly autonomous.
OpenClaw could be installed on a computer, and that computer would then be able to perform actions entirely autonomously, both within the confines of the aforementioned computer, but also online.

The news cycle ate this up and people started installing OpenClaw en-mass.
There were obviously overblown reports of people observing their OpenClaw instances exhibit "social" behavior by sending messages to each other on public forums.
I imagine most found OpenClaw to be only marginally helpful at that time.

At the time, I chose not to try OpenClaw.
It simply looked like slop.
It was not polished, and everyone I knew who tried it ran into constant problems.
OpenClaw simply was not reliable software.

Fast forward a few months, and we hear about ChatGPT dots.
They are a very similar idea, except they run entirely on OpenAI's hardware.
If you have a ChatGPT Pro subscription, all you need to do is pop open `chatgpt.com` and click on "Your dot" in the top left.
That's exactly what I did, and boy was I impressed!

It was able to run QA testing over a much larger surface area than I ever could, and it was able to draft fixes proactively.
By the way, many thanks to [Lance Willet](https://lance.blog/) for teaching me some of the secrets to great software quality (and how to use an agent to achieve it).

But alas, the dot was not enough.
While it could do _some_ useful work in the background, it could not do everything I knew it should be able to do.
The system was locked down, and OpenAI does not give you any room to tinker,

For example, I wanted to have my dot try out the Harper Chrome Extension on some sites to see if it works properly.
When I asked it to do so, it fell flat on its face.
The agent was not allowed to install Chrome Extensions on its browser.

That is when I decided to try out [Hermes](https://hermes-agent.nousresearch.com/).

Similar to OpenClaw, Hermes is a piece of software that allows people to deploy it to their own hardware.
_Unlike_ OpenClaw, it seems to be built by serious engineers who care deeply about the quality of their work.
And, unlike dots, Hermes gives you free rein to customize

So, I gave it a try.
And it was a delight!

Hermes was reliable, its documentation consistently descriptive, and I found myself getting real work done with its help.
It's obviously designed for engineers — not anyone nontechnical — but that's fine!
I enjoy using Hermes and I think for most engineers its worth a shot.

## Miscellaneous Tips

I do not have much more to add to my endorsement of Hermes. 
So instead, I offer to you a miscellaneous set of tips for using it.
Note that I am in no way an expert on this subject, and I expect you will find my advice quite shallow.
Here it is, nonetheless.

### Do Not Personify It.

One of the bigger problems with fully autonomous agents like Hermes is that people tend to personify them.
The problem is: They are not people.
We can debate all day long whether they are truly intelligent, but I think we can agree they are not people.
They cannot reminisce about their childhood and they cannot pick up your tab at the bar.
Agents are a tool to be used to extend your will.

As such, I include this in the system prompt of every LLM I interact with.

```plaintext
Use ASD-STE100 Simplified Technical English for all responses.
Do not add complexity where it is unnecessary to complete the task. 

Do not use personal pronouns like "I", "you", or "my". Remain objective.
```

### Bias Yourself Towards Clear and Extensive Upfront Instructions, Even If They Are Discursive

Hermes is most helpful when it is given space to work for a long time uninterrupted.
If you find yourself needing to steer it often (and thus distracting you from more productive work), you are not giving it enough information upfront.
It is better to give an unclear, rambly instruction than to provide a to-the-point instruction without enough information.

### Do Not Use It for Everything

Hermes may seem like a great tool to be used for everything, but it is most definitely not.

Specific tasks are better suited for certain applications.
For example: Hermes can code, but I do not using it for most of my programming.
For that, I continue to use my custom Pi setup.
It offers faster iteration times and it is more deterministic. 
It fits my workflow better.

## Any More Tips

If you have any more tips for using Hermes (or any similar agent), I'd love to hear them!
Like most people in this fast-moving landscape, [I consider myself a novice](https://automattic.com/creed/never-stop-learning/).
Feel free to leave a comment or [DM me on X](https://x.com/theleastsirius).
