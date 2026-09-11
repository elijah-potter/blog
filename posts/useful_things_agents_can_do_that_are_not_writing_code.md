---
"description": "This article is not about vibe coding. In fact, this article is about all the things you can do with an AI agent that are separate from writing code."
"pubDate": "Fri, 11 Sep 2026 21:39:44 GMT"
"keywords":
  - "keyword"
"image": null
"featured": false
"draft": false
---


# Useful Things Agents Can Do That Are Not Writing Code

The discourse is abuzz with the wonderful (and horrendous) things you can do when you allow an AI coding agent to write code.
People who allow an agent (née clanker) to write __all__ the code in an application are often called "vibe-coders".
This article is not about vibe coding. 
In fact, this article is about all the things you can do with an AI agent that are separate from writing code.

With each of these, I'll go through the use-case, then include the latest version of the `pi` prompt that I use.

I do __not__ believe you should use my prompts precisely.
I am not suggesting that you copy my workflow.
The beauty of many of these tools is that they are flexible and can be adapted to your style of work.
I offer my prompts as inspiration.
Maybe there are things you could be using an agent for that are __not__ writing code.

## Fix Merge Conflicts

I often find myself needing to fix merge conflicts for my PRs because either myself or an open-source contributor has modified the code upstream.
Almost always, these conflicts are formatting or boilerplate changes that do not need my full attention.
In other words, it's the perfect job for a clanker.

Here is my prompt:

```markdown
---
description: Fix a merge conflict in a PR.
argument-hint: "<PR NUMBER>"
---

I want you to fix the merge conflict in PR #$@.
If I have not provided a valid number, please ask me for it.

Do so by checking out the PR using the `gh` command, and perform the merge.
DO NOT push your changes until I have a chance to review them myself.
```

In `pi`, I can call this like a function:

```plaintext
/fix-pr-confict #4222
```

It does not matter if I have the relevant PR downloaded and checked out.
The clanker figures it all out non-destructively.

## Locate Relevant Issues

When working on open source software, I often prioritize fixing bugs that I find annoying and introducing features that [make my own life better](./do_that_which_makes_your_life_easy).
That's natural.
When I do, I want to know if I am accidentally solving someone else's problem at the same time.
If so, I can link the issue in my PR description or reach out to the person directly.

To find these relevant issues, I use this `pi` command:

```markdown
---
description: Find any issues relevant to this branch or a given PR number.
argument-hint: "<PR NUMBER>"
---

Please locate all issues that might be relevant to the current branch (unless a PR number is provided below).
Please list:

- If the issue is solved by this PR.
- The link to the issue.
- Who wrote it.

If not the current branch, look at PR #$@.
```

Again, this can be called like a function:

```plaintext
/fd-issue
```

## GH Actions Failures

90% of the time a GitHub Actions workflow fails, it is not due to a bug.
It's because I forgot to run my formatter or my static analysis tools (think Prettier or `tsc`).

In this case, it is not a piece of functional code that is broken, but an annotation or missing carriage return.
It is an easy one-line fix.
Why not make the clanker do it?

When a GitHub Actions run fails, I can use an agent with the following prompt to get it fixed tout suite.

```markdown
---
description: Diagnose any existing GitHub Actions failures for this branch.
argument-hint: "<BRANCH>"
---

Diagnose any existing GitHub Actions failures for this branch, unless there is a different branch provided below.
Once you have taken a look to identify the possible underlying problem, offer a plan to fix it. Do not implement this plan without express approval.

If not the current branch, look at $@
```

Again, it can be run as a command inside of `pi`:

```plaintext
/diagnose-action-failure
```

## Wrap-Up

Again, I offer these prompts as inspiration.
Are there things that you could automate?
If so, please let me know!
