# My Writing Environment As a Software Engineer

> __TL;DR: _Get a good text editor, and get good at using it.
> Keep a notepad by your side.
> Find a quiet place to write.___

Writing is one of life's greater joys.
It's a mental workout that often brings me a level of clarity that is hard to find elsewhere.
I have never sat down to write for an extended period of time without coming away with a greater understanding of myself and the universe.

I imagine that sounds pretty cheesy.

I just want to impress upon you the importance writing has had in my life.
As with anything this important, I have an instinctual urge to optimize it.
As software engineers, isn't that part of our modus operandi?
To spend an unnecessary amount of time optimizing things?

Well, that's exactly what I've done.
Over the years, I've spend a unruly amount of time tweaking and changing the tools I use to write.
I'd love to talk about 'em.

## Neovim

In the past few years, Neovim has the talk of the town.
Its ancestor, `vi` was borne from the observation that most writing is re-writing, and thus it includes a vast array of specific tools for editing text, rather than writing it.
[`r/neovim`](https://www.reddit.com/r/neovim/) has swelled to more than 110 thousand weekly visitors and thousands of plugins and LSPs to choose from.

Unless you choose a pre-built distro like [LazyVim](https://www.lazyvim.org/), Neovim does very little out of the box.
It is through relentless customization that it becomes something truly powerful.
Beside the various keybindings in my config, the important plugins and tools that I use are:

### [Harper](https://writewithharper.com)

As I'm the chief maintainer, this one should be of no surprise.
Don't worry, I won't give you the marketing spiel.
I'll simply say that Harper is a grammar checker that happens to work exceptionally well in Neovim.

### [Zen Mode](https://github.com/folke/zen-mode.nvim)

![Zen Mode: Activated](/images/zen_mode.png)

Plain Neovim organizes each file to cover the maximum amount of space on-screen. 
Practically, this means most of my text ends up on the left side, which can hurt my neck.
Zen mode restricts the width of the file and centers it on the screen.

### [Tatum](./the_simplest_neovim_markdown_setup)

![A screenshot of Tatum at work](/images/tatum_screenshot.webp)

Tatum is a small tool I wrote in a few hours that lets me live-preview my Markdown as HTML.
I won't repeat myself.
If you're curious about Tatum, check out my [previous blog post.](./the_simplest_neovim_markdown_setup)

### More Details

If you're thirsty for _all_ the details of my Neovim setup, take a quick look at the configuration code on [GitHub](https://github.com/elijah-potter/dots/tree/master/nvim).

## ReMarkable 2

A few years ago, while I was still in school, I splurged and purchased a used Remarkable 2.
Even now, there is rarely a day that goes by where I don't use it.
Sure, everything it does could be easily approximated by paper.
On the other hand, the thin device saves my back whenever I have to travel and there's a certain joy that comes from using an e-ink device like this.

![A Recent Brainstorming Session on the ReMarkable](/images/remarkable.jpeg)

I mostly use it to read digital books and blog posts, but it's also come in handy for getting around writer's block.
Being forced to slow down and use my hand to write, rather than a keyboard, is quite helpful in some inexplicable way.

## A Quiet Space

More important than any text editor, at least for me, is a quiet space.

As I said before, writing can take real cognitive effort.
A space with distracting noise can make it unnecessarily hard to get words on paper.
I've found local libraries or co-working spaces to be great places for quiet authorship.

Whatever you do, do not listen to music with words in it.
Even if it _feels_ more productive, I retroactively find that it makes me less so.

## Conclusion

There's probably some more important points I'm leaving out, but I definitely believe I've hit the big three.
For me, the most important parts of a good writing environment, as a software engineer, are my text editor, a notepad, and a quiet space.
