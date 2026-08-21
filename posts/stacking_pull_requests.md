---
"description": "I tried out GitHub's PR stacking functionality for the first time. It's amazing."
"pubDate": "Fri, 21 Aug 2026 20:54:32 GMT"
"keywords":
  - "Harper"
  - "GitHub"
"image": null
"featured": false
"draft": false
---

# Stacking PRs

I tried out GitHub's PR stacking functionality for the first time this week.
I have to say — it's amazing.

Instead of implementing the entirety of [Harper Desktop's Windows](./harper_for_windows) support in a single massive PR (as I tend to do far too often), I decided to separate the work out into individual PRs and stack them.

I am someone who goes on a lot of tangents while working.
While writing a new module or crate, I often find myself discovering problems with my previous work.
To get the new module to a place I am satisfied with, I will need to go back and make changes to something seemingly unrelated in order to keep up a high bar of quality.
Stacked PRs make this organizationally possible.
I can make my tangential changes as a part of a second PR, either before or after the current one in the stack.

It's really nice, I suggest you give it a whirl.
Plus, the TUI for it is pretty slick.
