---
"description": "Despite all my complaining about Windows Update and how bloated their software tends to be, Microsoft has successfully convinced most of the world to use Windows."
"pubDate": "Fri, 31 Jul 2026 20:36:39 GMT"
"keywords":
  - "Harper"
"image": null
"featured": false
"draft": false
---

# The Case for Windows

## Why Adding Windows Support to Harper Desktop Is Sensible

Despite all my complaining about Windows Update and how bloated their software tends to be, Microsoft has successfully convinced most of the world to use Windows.

At the time of writing, [72% of people with a desktop computer have Windows on it.](https://gs.statcounter.com/os-market-share/desktop/worldwide/) 

> "Erm, actually Elijah, that's not how market share works."

Okay, fine. 
If we look into the fine print of the statistic, it seems that it is in fact 72% of __web user agents__ who declare themselves to be running on Windows.
Close enough.

That's a ton. 
To put that in context: For every macOS user (which account for 15% of all users), there are nearly __five__ Windows users.
That's a pretty huge gap
Despite how much I'd like to see Windows put in its place, it's a super common operating system (and a pretty good one for most people, if I am totally honest).

To put it in investor-speak: The [TAM](https://en.wikipedia.org/wiki/Total_addressable_market) is plainly _way_ bigger than macOS.

When we first started our work on Harper Desktop during [Radical Speed Month](./what_was_radical_speed_month?), we only built it to support macOS.
Why only macOS, given this bounty of information about OS market share?
Honestly, it was because only 50% of the team (one of two, to be precise) had a Windows device, and we both had access to macOS devices.
Given that it was only supposed to be a month-long experiment, we felt comfortable not stressing about it.

Today, though, the desktop application is a big part of (what I imagine to be) Harper's future.
So today, I want to make the case that we need to add Windows support to Harper Desktop.
I write this post, not just for myself, but also to shed more light on the road map for those who have been asking me when we will be supporting Windows.

## The Cost of Adding Windows Support Is Low

Beyond being something we _should_ do, adding Windows support is something that will be _easy_ to do.

When we were in the rapid-prototyping phase of [Harper Desktop](https://writewithharper.com/desktop), we decided to use [Tauri](https://tauri.app/) for virtually all frontend code and [`winit`](https://docs.rs/winit/latest/winit/) + [`egui`](https://github.com/emilk/egui) for all the remaining rendering.
Since all three of these packages are platform-agnostic, they will likely need no more than a few tweaks to work on Windows.
Simple stuff.

Any code that touches the accessibility API would need to be rewritten for Windows.
Fortunately, all of that hides behind the `OsBroker` trait.
We would only need to implement a few (admittedly complex) functions.

Once the project itself is done, I estimate the marginal maintenance cost to be pretty low.
Compared to macOS, maintaining Windows applications is a breeze.
System APIs rarely change, and the developer tooling is _miles_ ahead.
[Unlike macOS](https://www.geeks3d.com/20180605/apple-announces-that-opengl-and-opencl-will-be-deprecated-in-macos-10-14-mojave/), Microsoft does not deprecate industry standards.

In fact, I believe that adding Windows support will have _negative_ marginal maintenance cost, since it will make it __far easier__ to debug platform-agnostic issues.
Bugs we find and fix in Windows (due to Harper's architecture) will also be fixed on macOS.
Pesky permission and rendering problems, begone!

## The People Have Been Asking for It

Ever since we put out the macOS app for Harper, I have been received a torrent of message asking for Windows support.
The people want it.
Let's give it to them.
