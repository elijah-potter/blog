# Harper Turns 1.0 Today

Today, we published [Harper's `1.0.0` release](https://github.com/Automattic/harper/releases/tag/v1.0.0). It's a huge milestone, and in this post I'd like to discuss why it took so long, why we're doing it now, and what's next for the project.

## A Round of Applause, Please

As I mentioned: This is a huge step for the project. Before I say anything else, I want to take a moment to appreciate the collective work of our many contributors. It has taken many iterations to get to where we are today, and it wouldn't be possible without the community's effort and feedback.

<figure class="wp-block-image"><img src="https://contrib.rocks/image?repo=automattic/harper" alt=""/></figure>

## Why Now?

Until today, I've kept Harper in a pre-1.0 state for one reason: I wanted to move fast. More specifically, I wanted the freedom to build and break things as many times as I needed to. I knew that it would take many cycles of building and rebuilding arrive at a robust system that addresses the people's need for a private writing tool. I believe that building something good can often mean taking the bad parts out. Once a project is "1.0", it becomes much harder to remove things. Naturally, that pushed me to hold off on "going 1.0".

Of course, that didn't stop us from getting the software into the hands of users. Today, tens of thousands of people benefit from Harper's fast and private grammar checking in Chrome, Obsidian, VS Code, and Neovim (among many others). We've racked up hundreds of thousands of downloads before ever slapping anything other than zero before the first decimal point of our version number.

I'm sure your thinking: "Elijah! Get to the point!" Fine. The reason we're doing this now, rather than earlier or later, is because our priorities have just recently changed.

For one, Harper's API has been rock-solid for a few months now, which means we can safely say that our need to move fast in that area has diminished. The opportunity cost of abiding by a stable API has gone down.

Secondly, I've been hearing progressively more interest from potential contributors and consumers who want to put Harper directly into their own apps or services. They have the desire to help make Harper more widespread, but they can't commit to it unless Harper commits to a stable API. That's what we're doing today.

I can imagine a future where Harper is natively integrated everywhere: learning management systems, document editors, messaging platforms, or even operating systems. But great things take time. Today, we're taking a huge step in setting Harper up for the long-term.

## What Do I Need to Know?

As an end-user, not much changes. From here on out, we'll be pushing quality-of-life tweaks and bugfixes at a faster rate, all while improving Harper's capabilities across the board.

As a contributor, the patch review process might get a little bit more strict. We'll be focusing more on improving the quality of our code, rather than the amount. If your PRs are likely to result in a breaking change, expect copious notes and possible delays before we hit "merge".

As an integrator, you win more than anyone. If you'd like to include Harper in your application, let us know and we'll do our best to make it easy for you. Take a look at [our versioning policy](https://writewithharper.com/docs/about#Versioning-Policy) if that sort of thing gives you peace of mind.

## Where Can I Get Further Updates?

That depends on the level of verbosity your interested in. For those who want to know about everything I'm currently working, subscribe to [my blog](https://elijahpotter.dev/). For everyone else, our [patch notes in GitHub](https://github.com/automattic/harper/releases) should suffice.
