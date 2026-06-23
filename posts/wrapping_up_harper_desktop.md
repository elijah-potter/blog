---
"description": "Radical Speed Month held an impetus to experiment, and experiment we did."
"pubDate": "Thu, 28 May 2026 19:31:33 GMT"
"keywords":
  - "Harper"
  - "Desktop"
  - "Automattic"
  - "Radical Speed Month"
"image": null
"featured": false
"draft": false
---

# Wrapping up Our Radical Speed Month

[I previously posted](./harper_desktop) about our launch of Harper Desktop.
If you have not read that already, I suggest you take a peek before reading forward here.

For those caught unaware, Harper is a grammar checker designed to respect the fact that your writing should be yours.
It is private by design, no matter where you decide to use it.
Thousands of people from all walks of life use it to express their thoughts online, skipping all the features found in other grammar checkers that suppress creativity and sell text to the highest bidder.

Until recently, our most popular and versatile integration was through a Chrome or Firefox extension.
It plugged directly into your browser and interacted with the various text editors you might encounter while browsing the web.

While this gave Harper the ability to enhance the writing of people who spent much of their time online, it did not do much for the makers and doers that use desktop applications like Scrivener, Slack, or Discord.
Harper Desktop sought to solve that.

It was build in only a month, with the combined effort of just two engineers, myself, and [Jason Adams](https://jason.blog/).
It was possible though dedication, hard work, and a willingness to learn.
[Radical Speed Month](./what_was_radical_speed_month?) held an impetus to experiment, and experiment we did.

In this post, I want to talk about:

1. The experiments Jason and I ran on ourselves.
2. Which we will keep, and which we will not.
3. Sandwiches.

I will _not_ be talking about:

- Why Harper Desktop is awesome.
- Why you should download and install it.
- Pizza.

## The Experiments

### "AI"

AI is a tool, one which I have written about extensively. 
Discussion of AI is repetitive and honestly pretty boring.
Which is why my "AI" experiment was not really about AI or LLMs.
It was about the kinds of tools I use.

For an exceedingly long time, my workflow has consisted of `tmux`, `nvim`, and the Rust compiler.
In the last year, that workflow has grown to include [OpenAI's Codex](https://openai.com/codex/).
I found myself more productive with it because I could delegate otherwise labor-intense tasks to it to be completed in the background while I worked on something else.

Even with `codex` available in my `$PATH`, I would still write most mission-critical code myself.
Part of this was from fear, but there were other [more important reasons too](./when_to_use_an_agent).

I wanted to see what would happen if I completely changed my workflow, just for one month.
I would commit myself to spending as much time with new tools as possible.
As it would turn out, the only tool I __stopped__ using was Codex.

This is [something I spoke about briefly before](./good_agents), but I have developed a more comprehensive view of the issue since, so I'd like to go over it again.

#### What I Used Instead

Instead of delegating tasks to Codex, I started delegating tasks to [OpenCode](https://opencode.ai/).
I found it far more effective.

To me, OpenCode's standout feature was how central it made "plan mode", which gave it permission to view (but not edit) my repository while I created a plan.
It could compare its understanding of my plan with the reality of the existing code, and ask clarifying questions when ambiguity arose.
This stood in sharp contrast to Claude Code and Codex, which would just go and start editing files, regardless of whether a plan was complete.

I liked this, but it still left some things to be desired.

OpenCode gave me byte-level control over the code it wrote before it started editing, but it did not give me a whole lot of control over OpenCode itself.
I found myself typing the same things over and over again, wishing for some kind of higher level macro system.

That's when I found Pi, an "agent" that intentionally does as little as possible.
In a lot of ways, it's like `neovim`. 
It does very little out of the box, but through customization it can become more useful than anything else.

Now, I find myself using Pi more often, not least because it gives me every piece of control I always wish I had.
Pi is the only LLM-based tool I have every tried that did not feel like it was actively slowing me down.

So in that way, I supposed the "AI" experiment was a success.
I will be continuing to use Pi.

### Meetups

Jason and I decided to work together for Radical Speed Month in part because we lived in "close" proximity.

You see, Jason and I both work at Automattic, which is [a distributed company](https://distributed.blog/).
That means that almost everyone works remotely.
There are a number of benefits to emphasizing asynchronous communication, and some downsides.
We wanted to get a better understanding of both the pros and cons by temporarily increasing the number of days we spent in-person working together.

So, twice a week, we would hop in our cars and meet somewhere, usually Castle Rock, CO.
We would spend the day talking about big ideas, working on our individual tasks, and consume a likely unhealthy number of sandwiches.

I personally found these in-person days motivating.
I would come home at the end of the day excited to get back to work.
I felt like I had a renewed sense of purpose and drive.
It was intoxicating.

I think a huge part of this feeling was a consequence from Jason's personality. 
We seem to mesh together well, and I have noticed that he has a tendency to amplify the best qualities in the people he leads.

That said, I do not think that 100% in-office work is sustainable in the long term.
I found that the days we were together, I was not quite as able to "lock in".
We had fantastic discussions and our decision making process was a million times faster than it would have been otherwise, but it was just that little harder to turn the talk into action.
Similarly, I found it more difficult to convey certain kinds of technical information. 
When we needed to explain something in depth, I felt the compulsion (which could be fought, I suppose) to send a link later, rather than try to explain it in the moment. 

In the end, I think that Matt's original conclusion on meetups is still correct.
He says that in the same way that ["a little salt makes the dish"](https://distributed.blog/2023/05/26/episode-30-meetups/), a few meetups every so often can bring together the best parts of both in-person and remote work.

So, I would say that our second experiment was also a success.
I personally feel as though I have earned a better intuition for what kinds of work are better in person and what are better async.

## The Fallout

Immediately after announcing Harper Desktop, I got a flood of messages from people who had downloaded it, installed it, and found all the bugs in it.
That was both good news and bad news.

It was good because we could be confident that we were indeed building the right thing.
People want a desktop version of Harper and they want to help us make it as awesome as it can be.

The was bad because, well, there were a ton of bugs.
Over the last few days, I have been baking them out of the software as fast as possible.
You should be getting a __significantly__ improved piece of software in the coming hours.

Would I have postponed the launch, had I knew about these issues?
Yes.
But I did not, which is why we do software launches like this.
There's no way to fully expect every issue that comes up, so you need to do a little ad-hoc user testing.
I consider this a success.

## Conclusion

I really enjoyed Radical Speed Month.
It was a hard stretch of learning a lot about a variety of subjects, most of which I have not even mentioned in this post.
I am energized and excited to apply them to my daily work, and in hardening Harper Desktop.
