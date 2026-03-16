# Do Not Write with an LLM

![A photo taken by myself of a green bird.](/images/green_bird.webp)

## A Growing Trend

I have been seeing an increasingly prevalent trend of people showing up in online spaces proudly flaunting that they are writing with the assistance of AI.
I often see them clarify that they are going further than letting the model perform grammar or fact-checking.
They are describing an idea to an LLM, and giving it complete control over the final written document.
They seem to be proud of this. They shouldn't be.

## What __Does Not__ Work

Writing seems to be a shadow of a more fundamental and useful process we like to call "thinking".
There is a reason why LLMs, which are the closest thing we currently have to "software that thinks" is trained to think through writing.
It seems logical, then, that we can use this "software that writes" to help along our own thinking process, right? Wrong.

Writing is one of the most cerebral activities that humans do on a regular basis.
[I try to sit down and write about a complex topic at least once a week.](https://elijahpotter.dev/articles/why-i-talk-to-myself)
There are a number of reasons I do that pertaining to my job in particular, but there are more generally applicable reasons that can apply to any profession.

When a mathematician needs to think critically about some theorem or proof, they often turn to a dry-erase board or a chalkboard.
The mathematician then writes in clear notation what they imagine the problem to look like in their heads. 
From there, they can manipulate that notation until they reach their desired outcome.

The English language is extremely similar, with a key difference.
Mathematical notation is specifically designed for a narrow domain.
Natural languages, on the other hand, can be applied to any field.
By writing your idea down on paper (or in a Google Doc, it does not matter), you give it substance.
This substance can then be shaped iteratively towards a goal of some kind.

No great ideas were written down on the first try.
They started as a vague notion, and through writing and rewriting, they became something concrete and valuable.
You cannot dictate a vague notation to an LLM and expect it to spit out something tangibly valuable.
Any attempt to do so is lazy, and it will result in failure.
I have seen it in the wild, and frankly, it is a little embarrassing.

[This article](https://ammil.industries/i-know-you-didnt-write-this/) feels especially relevant today.

## What __Does__ Work

Using an LLM for research can be very effective.
Searches to ChatGPT or Perplexity can surface information faster than digging around in a book you read three months ago.
For lots of searches, these two sources have completely replaced Google and DuckDuckGo for me.

They're also quite excellent fact-checkers.
I've seen that plenty of folks have received quite good results by pasting their work into an LLM with an internet tool (like ChatGPT with Thinking enabled).

Finally, I've personally found that LLMs are quite good at finding places where I simply forgot to insert context.
Sometimes I forget to define a term or insert a relevant link.
Even small models like `gemma3n:e2b` can catch me. 

## What __You__ Should Be Doing

When you need to communicate an idea in your head, sit down with a notepad and a keyboard and explain it. 
I personally think you should use a grammar checker, since they are far less likely to impede your thought process, but if you need to, you can instruct ChatGPT to critique your work once it is finished.

If an idea deserves an audience, you're capable of writing it out yourself.
In the same vein, if you can vaguely describe it to ChatGPT, you can vaguely describe it to your intended audience. 
Do yourself a favor and skip the middleman.

## What We Should Be Building

Now, I'd like to enter the section where I talk specifically about what this all means for people who create tools for writers.
That includes both Harper and WordPress.

A tool that helps someone write is a tool that directly interfaces with how that person thinks.
That might include what they think about, but more concretely I am referring to the actual day-to-day process of thinking through complex ideas.
If you don't believe me, it's probably because you skipped ahead instead of reading this post from the beginning.

Most crucially, we cannot allow ourselves to build tools that dissuade people from expressing their ideas in the way they imagine.
This can take the form of friction, like building tools that are so cumbersome that one dreads to open them at the start of the workday.
This can also take the form of a tool that crushes or overwrites an author's core message.

A common complaint I hear about Grammarly (from people who have switched to Harper from Grammarly) is that it's too demanding. When they write prose in a creative or unusual fashion, their service often forces them back into a colder and more formal way of speaking.
We don't want to be like them.

For Harper, that means we need to be diverse in our training datasets and mindful of feedback from our users.
For WordPress, it means we need to encourage our LLM integrations to tread lightly and respectfully.
They need to accept when they're wrong.
Just as any good human should. 
