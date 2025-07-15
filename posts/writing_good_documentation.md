# Writing Good Documentation

I believe that good documentation is more important than ever. In an age where large language models have exceptional context windows, it's easy to fall into the trap of believing a system is simpler than it is. To test the limits of their abilities, I'll often feed Harper code in and ask for their explanation of it's inner workings.
They've never gotten it anywhere close to correct.

That's because good documentation is more than the sum of its parts. It should contain all the relevant technical details needed to work on a repository, but it should also provide a sense of quality and direction. It should distill an ability within the reader to tell what good code and conduct looks like.

I think this is an area Harper could do to improve on.

## It's Possible to Write Too Much

Too much text can be overwhelming.
I have met many people (myself included) who believe that more detail is always better.
That as long as the information exists somewhere, someone will be able to find it.
In reality, that's just not true.

That brings us to our first rule: __good documentation should be simple__.

The worst way to describe a complex system is with complex language. 
It's much better to first break it down into simpler parts.
From there, you can build it back up again.

I've found it effective to start by erring on the side of "too much", only to pare it down later.

Needless to say, it's also possible to write too little.

## Focus on _Why_

The code itself is (or should be) the best description of _how_ the software works.
Documentation should complement this reality by describing _why_ the software works that way.

This might include a little history.
What steps did the original code's author take before arriving on the final solution?
[A blog](https://elijahpotter.dev/) is a great way to answer that question.

When describing a bug relevant to some code (like in a pull request), a picture is worth a thousand words.
It's much easier to show a problem than to describe it.
That's why I highly suggest you take a screenshot of the problem.
Even better: record a video recreation of it.
