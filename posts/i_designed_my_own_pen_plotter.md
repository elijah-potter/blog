# How I Designed (and built) My Own Pen Plotter

For the last few months, after reading Preslav Rachev's book [Generative Art in Go](https://p5v.gumroad.com/l/generative-art-in-golang), I have been playing around with writing algorithms that create interesting graphics. I eventually ended up building a [modular canvas library](https://github.com/elijah-potter/denim) for Rust to make that easier to do, for me and other people.

After making a few algorithms and posting them to the web, I started looking around for more inspiration. I happened upon a video with this pen plotter:

![A screencap of a pen plotter from Reddit](/images/reddit_pen_plotter.png)

I was amazed. A robot that could draw _vector graphics_? I had been nerd sniped.

![XKCD Comic #356](/images/xkcd_nerd_sniping.png)

## The Math

The mathematics involved interested my especially. How do you translate $\begin{bmatrix} x & y \end{bmatrix}$ to rotations of motors? It intimidated me a little at first, but once I sat down and worked it out, I realized it was surprisingly simple.

![A diagram of the math involved to create the plotter](/images/plotter_math_diagram.png)

We consider that the two motors are simply lengthening or shortening each string a specific amount. Here are the equations that dictate the length of each string, given a point $\begin{bmatrix} x & y \end{bmatrix}$, and a distance $m$ between the two motors.

$$
\sqrt{x^2+y^2} = r_0
$$

$$
\sqrt{(x-m)^2+y^2} = r_1
$$

## Is This Actually Going to Happen?

I initially sat down and did the math out of curiosity. I wasn't planning on building anything. After realizing the elegant simplicty of the math, I falt empowered to go through with it. I threw together a parts list.

![A visual of all the parts needed for the plotter](/images/pen_plotter_parts.png)

### Materials

- Whiteboard
- Expo Marker
- 2 Stepper Motors
- 3D Printer Timing Belt
- Arduino
- Adafruit Motor Shield
- 12V 2A Power Adapter
- Duct Tape (as any project requires)

I wanted to build this from scratch, without using anyone else's designs or software.

I order the materials off Amazon and soon enough, I had everything I needed.

## Putting It All Together

The first step was to solder the motor shield onto the Arduino, and wiring up stepper motors. I used my school's laser cutter to make a little bracket.

![The stepper motors mounted to a bracket](/images/mounted_motors_pen_plotter.jpeg)

I am using weights to balance the belts on the motors. I mounted it to a whiteboard so I can iterate in software faster/easier.

![Everything taped onto an old whiteboard. It's super rough, but that's OK](/images/mounted_bracket_on_whiteboard_pen_plotter.jpeg)

I initially didn't have the timing belt, so I prototyped with an old length of wire. This is the last picture before I wrote all the software, which I want to talk about before I show you that version.

## The Software

There are two, separate programs that, together, make the plotter work. The first is running on the Arduino, accepting commands over serial from the second, which is running on a USB-connected computer (my laptop).

There are three main reasons there needs to be a laptop in the system:

1. The Arduino doesn't have enough program memory
1. The Arduino cannot easily accept files (like SVGs)
1. It takes forever for an Arduino program to compile and upload, which makes iteration frustrating.

### Arduino

The Arduino is running a very simple loop:

1. Receive two 32 bit signed integers over serial (one for each motor)
1. Linear interpolate the stepper motors to positions described by received integers

That's it. It's important that the time it takes for each motor to reach it's destination is the same.

### Laptop

The laptop is doing all the math.

I am used my canvas library [Denim](https://github.com/elijah-potter/denim) to do all the virtual drawing. I just added a renderer that:

1. Converts all points to a sequence of belt-lengths
1. Converts belt-lengths to sequence of motor movements

And sent the resulting motor movements over serial to the Arduino.

I also wrote a quick little parser using [nom](https://github.com/Geal/nom) to parse and execute the math commands you can find inside SVG `<path>` elements.

## Final Results

![The first drawing on the plotter: the letter A](/images/pen_plotter_drawing_a.jpeg)

As you can see, I also made a big, rectangular box, to hold the marker. It worked alright, but not great. You also probably noticed the main limitation of my design: it cannot lift the marker off the whiteboard.

I figured the roughness was mainly due to unbalanced weights and the slant of the whiteboard. I adjusted everything and tried again.

### Take Two

![A slightly improved letter A](/images/pen_plotter_drawing_a2.jpeg)

This one is much better. The lines are crisp, and exactly where they are supposed to be. At this point I wanted to try something a little more advanced out. Something a little more **generative**.

### The First Hilbert Curve

![An attempt at drawing a hilbert curve](/images/pen_plotter_drawing_hilbert.jpeg)

After seeing the plotter draw a Hilbert Curve, I felt proud _and_ a little disappointed. The corners aren't crisp, the lines aren't straight. Frankly, it looks like it was drawn by a two-year old.

### Solving the Issue

![The final attempt at a Hilbert Curve](/images/pen_plotter_drawing_hilbert2.jpeg)

It worked! Now all the lines are precise, crisp, smooth. The biggest issue is that the marker itself rotates as it moves. That wouldn't normally be an issue, but the marker is chiseled, so it results in varying levels of pressure on the whiteboard.

## Conclusion

This was a really cool project. I learned a lot. I am not very experienced with robotics, so this really challenged me. I intend on continuing working on it. I want to add the ability for the pen to lift off the canvas, and really solidify the marker holder. Most of all, I look forward to taking my projects into the _real_ world.
