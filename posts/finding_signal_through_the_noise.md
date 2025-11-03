# Finding Signal Through The Noise  

As the maintainer of [Harper](https://github.com/automattic/harper), I read through dozens of issues and pull requests per day and countless more per week.
There is a constant flood of new problems to fix and new code to review.
At times, it can get overwhelming.

I've been working recently to reduce the amount of noise I encounter when determining what to work on.
I'm sharing my findings here to help other novice maintainers handle the torrent.
Hopefully, there are some ideas here that you find insightful.

When your open source project gets big enough, you inevitably hit a point where the flow of bug reports or feature requests expands beyond what you're individually able to fix or implement.
If you're like [Jeff Geerling](https://www.jeffgeerling.com/), this might happen when you find yourself maintaining a larger __number__ of projects.
Either way, it's clear that there will come a time where you need to start making hard decisions on how to spend your time.

## Set A Policy

Jeff's solution, which I've adopted, is to set [well-defined](https://www.jeffgeerling.com/blog/2020/enabling-stale-issue-bot-on-my-github-repositories) policies for which issues are allowed to slip through the cracks.

The strategy is simple in essence.
The maintainer, Geerling or I in this case, directly addresses issues and PRs which are important to the existing functionality of the software first.
New features or minor bugs come second.
Feature requests that help a single person or a bug reports that address a rare edge case are of lowest priority.

If an issue or pull request cannot be addressed within 30 days of its opening, it is marked stale.
If another 30 days pass before it becomes active again, it is closed.
Over time, unimportant topics are cleared away, leaving only the ones critical to the project's mission.

A policy like this sets "no" as the default and helps prevent runaway code quality declines.
I instituted it on Monday.
If it needs revision, I'm open to comments and feedback.

### Harper's False Positives

This policy stands in the face of an almost overwhelming number of issues related to false-positives in Harper's algorithm.
[Here's a representative example.](https://github.com/Automattic/harper/issues/2124)

Since these false-positive reports represent such a significant plurality of the issues on GitHub, I feel the need to handle them separately from everything else.
They're usually resolved quickly but left open out of neglect. They're trivial enough for me to fix, but not for me to follow-up.
Moving forward, if anyone needs to report an issue related to a false-positive, please do so [here](https://writewithharper.com/report-problematic-lint).

## Develop a Sense of Importance

There is no algorithm to determine which issues or PRs are the most important to a project's success.
Typically, I'll read through five or so, and pick the one that "feels" the most important to work on.
It's often a balance of prioritizing time-sensitive items, items that could result in publicity, and usefulness to my personal work.
It's hard to put it into words, which is why it must be developed, not taught.

## What Do You Think?

I consider myself a novice maintainer, so I'd love to hear from more mature maintainers.
How do you find signal through the noise?

---

## Additional Reading

- [Why I close PRs - Jeff Geerling](https://www.jeffgeerling.com/blog/2016/why-i-close-prs-oss-project-maintainer-notes)
