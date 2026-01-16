# Imagine a Weir Studio

This week, I received a message from someone working on a learning management system.
Apparently, they use [`harper.js`](https://www.npmjs.com/package/harper.js) to do spell and grammar checking on internal documents.
They wanted to be able to configure [Harper](https://writewithharper.com) to catch a specific class of mistakes that are common to their workflow.
Looking through the documentation for `harper.js`, they couldn't see a way to do what they wanted.

Naturally, I directed them toward my recent work on Weir, an expressive programming language for locating errors in natural language.
For those just catching up, this post is a part of a series.
You shouldn't need to go back and read my previous posts, but I'll link them here anyhow.

- [Building The Weir Language](./building_the_weir_language)
- [Updates on the Weir Language](./updates_on_the_weir_language)
- [Generating Weir Code With LLMs](./generating_weir_code_with_LLMs)
- [Imagine A Weir Marketplace](./imagine_a_weir_marketplace)

Unfortunately, I had to inform them that Weir is still an experiment (although it's in the `master branch` and thus used by `nightly` users) and therefore isn't yet available through public channels.
That said, it's an experiment I'd like to make available to the public soon, alongside the Weir Marketplace. 
Before I do so, I want to make it as easy as possible to author rules using Weir.
That's why I'm introducing the Weir Studio.

## The Weir Studio

The Weir Studio comes from a pretty simple idea. We want to give people all the tooling necessary to build and distribute Weir rules without any upfront cost.
That means there should be no tools that need to be installed, no specific operating system set up, and no programming experience needed.

![The Initial Version of the Weir Studio](/images/weir_studio_draft.png)

The solutions to the first and second items are simple:
Just like any other component of Harper, we can compile Weir to WebAssembly and connect it up to a web application.
Using off-the-shelf components for terminal emulation, text editing, and virtual filesystems, we can present a meaningfully feature-rich development environment from inside the user's browser.

The last item is also straightforward.
I've [demonstrated that LLMs are already terribly effective at writing Weir rules](./generating_weir_code_with_LLMs).
By making that situation obvious and accessible, we can empower people to write and distribute their own Weirpacks (files containing one or more Weir rules) without any prior understanding of the language or even of basic programming principles. 

The Weir Studio is [still in progress](https://github.com/Automattic/harper/pull/2491), but the initial versions are already proving extremely effective for [some of my other work.](https://github.com/Automattic/harper/pull/2506)

## Putting Power Back into the Hands of Users

A common frustration with tools like Grammarly or QuillBot is that they lack customization, and thus are often unable to directly address user's needs.
By allowing users full access to the internals via Weir, we can help them help themselves while also encouraging people to contribute back to the project.
It's a win-win!

## What's Next?

I'd like to wire this up to a marketplace as soon as possible (see what I did there?) to streamline the publishing process.
More critically, I've been informed that the inclusion of dictionary files directly into Weirpacks should be priority number one.
I'll likely start tackling that as soon as I have a spare moment.

If you have thoughts on where Harper or Weir is going, please don't hesitate to voice them.

---

P.S. [A great piece was just published about Harper.](https://www.makeuseof.com/stopped-paying-for-grammarly-once-found-free-open-source-alternative/)
