# How I Built Software Renderer from Scratch

Computers are fantastic at processing, producing, and consuming data.
But I've often found that the most difficult part of the pipeline is representing the data to a user.
This can often take the form of bar charts or scatter plots, but there are situations where they just don't fit the bill.

3D graphics enable developers to create interactive programs that appear most similar to the natural world.
By presenting a three-dimensional space, the barriers for entry drop. 
I wanted to learn more about how this worked.

![Star Fox, one of the earliest major successes of 3D graphics in the gaming industry.](/images/star_fox.png "Star Fox, one of the earliest major successes of 3D graphics in the gaming industry.")

## Inspiration

For a long time, I've been told that the most prevalent application of linear algebra was computer graphics.
Before I even began my independent study, I knew I would eventually get around to doing something like this.

One of the big roadblocks was the amount of technical know-how I thought it required.
You see, most 3D programs do all the number-crunching on the specially designed __graphics processing unit__ that is readily available on most modern computers.
From my previous attempts to use GPUs, I knew setting up the pipeline is quite involved, with much math.

Since I wanted to focus on the math, I postponed the project.
That is, until it occurred to me that I could simply _not use the GPU._
I know it might sound obvious, but it felt so freeing at the time.

### What Are Software Renderers?

A software renderer is, as it may sound, a renderer that does all computation in software.
No specialized hardware is utilized __at all.__

## Demo

Before I get into __how__ it works, I want to give you the chance to try it out yourself.
I've created a __very__ simple scene to demonstrate.

| Function      | Key |
| ------------- | --------------: |
| Look Around | Left Mouse Click |
| Toggle Depth Buffer | R |
| Toggle Face Sorting | O |
| Toggle Backface Culling | B |
| Increase FOV | Arrow Key Up 🔼 |
| Decrease FOV | Arrow Key Down 🔽 |
| Move View | W, A, S, D |
