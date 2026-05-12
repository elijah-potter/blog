---
"description": "Working this past week with Jason Adams has given me a brand-new appreciation for the category of ideas that we engineers call 'product.'"
"pubDate": "Fri, 01 May 2026 22:00:42 GMT"
"keywords":
  - "Harper"
  - "Desktop"
  - "Automattic"
  - "Radical Speed Month"
"image": "/images/jason_elijah_garden_of_the_gods.png"
"featured": false
"draft": false
---

# Product, Product, Product

Working this past week with Jason Adams has given me a brand-new appreciation for the category of ideas that we engineers call "product."

For a long time, I've discussed the difficult-to-define word "Quality" and it's importance to the success of software projects.
To me, capital "Q" Quality meant that a piece of software was fast, extensible, and reliable.
It was a checklist and a series of metrics that could be tracked and optimized through iteration.
I had, and arguably still have, an engineer's definition of "Quality".

But the version of Quality that can be defined with numbers is not complete.
A complete definition of Quality includes something that I currently don't know how to define.
People like Jason Adams and Eduardo Villuendas can.

At the end of Radical Speed Month, my goal is to be able to describe it, at least shallowly.
Right now, I feel that I understand some of the base components, but not well enough to bring them together into a cohesive whole.

## Harper Desktop

Harper Desktop is coming along amazingly! 
My goal for this week was to get the full pipeline working.
That means:

1. Reading text from arbitrary text areas on macOS.
2. Locating errors within it using `harper-core`.
3. Rendering highlights over those errors.
4. Showing a suggestion popup to users so they can review potential corrections.
5. Applying the corrections.

This is a pipeline that we've successfully replicated in several other apps, but this is the first time we've tried to do it system-wide.
I'm pleased to say: It's all working!

<video width="100%" height="400" controls>
    <source src="/videos/macos_harper_desktop_demo.mp4" />
</video>

The only thing missing from a "complete" Harper Desktop experience is configuration.
Users need to be able to manipulate their dictionary, update their rule preferences, and whitelist (or blacklist) apps from being manipulated by Harper.

Fortunately, Jason Adams has been hard at work refining what Harper's settings menus look like. 
Actually, to say that is __all__ he has been doing would be disingenuous.
In reality, he has been revamping the entirety of Harper's design and look.

![A Preview of Jason's Settings Page](/images/jasons_settings_preview.png)

The hope is that much, if not all, of Jason's work here will be ported back to the Chrome Extension. 

## The Magic of Meetups

I have never felt the magic of meetups more than during the short single-day meetups that Jason and I have been doing over the past few days.
I feel more productive, motivated, and optimistic than ever, and I think that is in no small part thanks to meetups. I get the hype now.

![A Quick Jaunt to Garden of the Gods](/images/jason_elijah_garden_of_the_gods.png)
