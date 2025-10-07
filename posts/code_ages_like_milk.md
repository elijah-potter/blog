# Code Ages Like Milk

![The Front Range in the summer is hard to beat](/images/front_range.webp)

A bold title, no? But it’s true, and it’s something that I (and most other maintainers) have to deal with on a regular basis. Failing to account for this reality can slow down development and dissuade contributors from sticking around.

As the chief maintainer of Harper, one of my main jobs is to act as quality control. I receive [a number of PRs each week](https://github.com/Automattic/harper/pulse/monthly), both from new contributors and old. Given the diverse pool of contributors, it makes sense that I review a diverse pool of code of varying levels of quality.

When I have my head down on technical and attention-intense projects, I have less time to review code. When I have less time, I need to set priorities. The question becomes: Would I rather let code from high-quality, reliable sources pile up, or code from sources of unknown quality?

I usually end up reviewing the high-quality sources first, since they’ll likely require fewer revisions. Fewer revisions means quicker merge means improving the user experience faster. Whether or not this is a good decision is something I’ve been thinking about all week.

## Code Ages

As code sits stagnant in a PR, it ages. You might say I’m crazy, that there is no way the code itself changes as it sits still in an unmerged and unmodified PR. I’d say you’re right, except for one teeny-tiny detail: Code only has meaning when it sits within a broader context. If that broader context changes (for example, when other PRs are merged) the meaning of the unmodified code does too.

Let me put it another way. If the patch from a PR remains stagnant, but the code it gets patched onto changes, the actual impact of the patch does too. This can cause all sorts of problems, from merge conflicts to erroneous test failures.

The longer code sits in a PR, the more time it usually ends up taking me to get it merged (when I finally have the time to get to it), just from the merge conflicts alone. It’s the Lindy effect rearing its ugly head once more.

## Features Age Too

Not only does code age when left untouched and unused, so do the features they represent. If a user requests for a button that marks some text as bold and they don’t receive that feature promptly, they’ll find an alternative solution, possibly from a competitor.

The rest of the app can evolve too. If you’re an individual contributor, it’s in your best interest for your code to make it to master. If that doesn’t happen quickly enough, another contributor (or, if the software is extensible, like Obsidian or WordPress) or plugin author might beat you to the punch.

## What Can I Do About It?

I believe the way I’ve been handling this until now has been entirely wrong. I should be allocating more of my time to training new contributors and fielding PRs from established ones. Open sources is a team effort.

As for you, dear reader, that’s for you to figure out. The worst way code can age is if it stays in your head. Don’t let your ideas go to waste. [Open that PR](./never_wait), or remind your reviewer to take another look if you haven’t already.
