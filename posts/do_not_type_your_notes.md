# Do _Not_ Type Your Notes

![A man taking notes on pen and paper](/images/pen_paper.webp)

I feel it necessary to make it clear who I am speaking to.
First and foremost, I am speaking to anyone who is considering switching to a typed note-taking system for school.
If you already value handwritten notes, none of what I say will likely apply to you.

For the last two years, I've typed my notes.
It has worked well for me.
_Really well._
For a time, I believed that it gave me a leg-up compared to my peers who handwrote their notes.
I still think that is true, for that specific context.
A context I no longer reside in.

This article is also a reflection.
I will return to the fact that any kind of note-taking is a personal, customized process.
I want to look back at what worked, why, and why it doesn't work anymore.

In his books, Cal Newport has recommended to students taking non-technical courses to type their notes.
This is for a number of reasons.
For one, typing is pretty much universally faster than handwriting, to the point that [some believe](https://radiolab.org/podcast/wubi-effect) it was a major economic advantage to cultures who spoke languages with smaller character sets. 
If I can write down more information, I will have a better record of the lecture, and thus an easier time studying later.
If I was taking history, creative writing, psychology, or business, and I intentionally paraphrase all my notes, I can paste them into my essay outline and use it as a framework.
Further, getting good at $\LaTeX$ and edit-focused text editors like [NeoVim](https://neovim.io/), I found I could decimate my revision time.

Unfortunately, this only applies to humanities classes.
If you are focused on any of the classes mentioned above, this articles doesn't apply to you.

## It's Hard to Keep Up

Yes.
I just said that typed notes allows me to record more information.
This is true for humanities classes that are working primarily in English.
This is _not_ true for technical classes that are working primarily in _math notation._

Pretty much the only way to reliably record mathematical expressions is via $\LaTeX$.
Sound simple? 
__No.__

### An Example

You can perform ideal gas computations using the formula $PV = nRT$.
If you want to find the total weight of a gas given the volume, temperature and pressure, you can rearrange to form the expression $\frac{PV}{RT} * \text{molecular weight} = \text{total weight}$.

So far these expressions have been pretty simple.
The one above looks like:

```latex
\frac{PV}{RT} * \text{molecular weight} = \text{total weight}
```

Using a combination of manic typing and [LuaSnip](https://github.com/L3MON4D3/LuaSnip) shortcuts, I can manage to generate the formulas during the lecture with a little time to spare.
Once you start plugging in values, however, it gets difficult.

If we are looking at hydrogen, and we use values of $V = 27.0 \text{ liters}$, $P = 755 \text{ torr}$, and $T = 31.3 \text{ celsius}$, the full expression looks like:

$$
\frac{(27.0)(\frac{755}{760})}{(31.3 + 273.15)(0.08206)} \times (2.016) = 2.16
$$

If that still looks simple to you, take a look at the $\LaTeX$:

```latex
\frac{(27.0)(\frac{755}{760})}{(31.3 + 273.15)(0.08206)} * (2.016) = 2.16
```

There are two separate problems here.

1. The $\LaTeX$ is not quite self describing.
   In order to get a good grasp of what it represents, I have to render it out to either HTML or in a `pdf`.
1. It is extraordinarily difficult to write and revise.
   Even with snippets and a good grasp of the keyboard, even minor edits are laborious. 

The net result: lectures become manic, unsuccessful attempt at replicating the chalkboard in $\LaTeX$, not an actual learning experience.

## Computers are Distracting

I've [spoken](/videos) on the negative effects of social media before.
Needless to say, social media has a [significant effect](https://doi.org/10.5817/CP2019-1-4) on academic performance across the board.
An enormous pile of scientific evident has proven that reducing social media use makes you a happier, healthier, more productive human being.
Taking notes on the same device I use for entertainment is a recipe for distraction.
This is why I don't like iPads.

There are distractions on laptops too.
I found myself Googling my questions instead of asking the professor.
Email was constant disturbance, interrupting at what seemed like the most opportune time.
If I had a stray thought about any of my side projects, I invariably found myself working on them instead of participating in the lecture.

These are extreme examples, and they didn't occur often, but when they did, they were significant.

## Customize

Books like _Deep Work_ by Cal Newport and _The Happiness Advantage_ by Shawn Anchor claim to be able to help readers become a happier, more productive individual.
Both books start by acknowledging that the most successful people customize their work strategies to what is optimal for _them_.

When I asked other members of the NeoVim community, their response was pretty similar.
By creating flexibility in my study and work process, I can shift around and find what works best for me.
Typed notes do not easily provide this flexibility.

### The Flexibility of Handwritten Notes

Personally, whenever I type my notes, they become a form of graph, almost always a tree.

![A subset of Chinese history expressed as knowledge graph](/images/china_history_graph.webp)

The above is what I am intending to write in my mind.
But given that I am working in unformatted text, it ends up looking like:

```markdown

# Chinese History

## Warring States Period

### Lao Tzu

This is some information on Lao Tzu

### Confucius

This is some information on Confucius

## Civil Service Exam

The civil service exam was initally based on Confucian values, and resulted in a highly educated government.
```

While this is a non-technical example, it does well to represent the problem I am speaking to.
With a pen and paper, you are physically writing out the associations between concepts.
When typing notes, you must do so linguistically.
When handwriting notes, you have the opportunity to include navigational components.
You can physically place different concepts in different places, and interrelate them similarly.
By transcribing your full two-dimeninsional mental map, you are starting to utilize the parts of your brain normally reserved for navigation.

I suspect this is why retention is often so much higher with handwritten notes.
Human navigational memory is the most accurate and long-standing kind.
This likely comes down the navigational challenges of early hunter-gatherers.
Sport memorizers invariably turn to this kind of memory to remember long sequences of seemingly meaningless information.

By associating the physical location of information in my notes with the information itself, I am able to retain the information more accurately.

## Final Thoughts

Do I regret not switching to handwritten notes sooner?
__No.__
Will I continue typing my notes in humanities classes?
__Yes.__

I know I phrased the title is a primarily instructive way, but there is only one thing I want you to remember: taking notes is an ultimately personal process. 
__Do what works for you.__
Similarly, I am just now entering what feels like a new world possibility.
It may _not_ end up going as well as I theorize.
Either way, you will hear from me again.
