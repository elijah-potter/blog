# The Simplest Neovim Markdown Setup

I am not one who enjoys complexity.
I am also someone who likes to make their [own tools](https://github.com/elijah-potter/harper).

As a student, I write a lot.
That includes notes, papers, and documentation for my wide variety of projects.

A lot of classes request to submit assignments as either PDF, HTML or `.docx`.
For a while, I submitted PDF's.
I had a whole orchestrated setup.

I would write everything in [Neovim](https://neovim.io/), save it, and [KNAP](https://github.com/frabjous/knap) would render it using [Pandoc](https://pandoc.org/).
Finally, it would be rendered to my screen using [Sioyek](https://sioyek.info/).

This worked fine, I guess, but it was far from perfect.

1. **It was slow.** Each edit I made in Markdown could take as many as 10 seconds to show up in Sioyek.
1. It wasn't interesting. While I made modifications to my Pandoc settings, my PDF's still looked like every other `pdflatex` document ever made.
1. I couldn't make my documents interactive if I wanted to.

Markdown was designed to be turned into HTML, I reasoned.
So why not just do that?

![A screenshot of Tatum at work](/images/tatum_screenshot.webp)

That's why I created [Tatum](https://github.com/elijah-potter/tatum).
It does one thing, really well.
Point it at a Markdown file, and it will run a tiny web server to render the resulting HTML to.
If the file changes, a WebSocket connection tells the browser to refresh.

Tatum renders in milliseconds and creates beautiful pages with [$\KaTeX$](https://katex.org/), [Simple.css](https://simplecss.org/) and [`highlight.js`](https://highlightjs.org/).
I can embed interactive HTML, CSS and JavaScript elements directly into my Markdown to get the interactivity and aesthetics I desire.

Once I'm done working, I just run `tatum render <file.md>` and I get a single file (images and all) that I can submit for my assignments.

Tatum isn't for you to use.
Feel free to poke around at how it works, or even fork it and make your own modifications.
**It fits my use case perfectly.**
