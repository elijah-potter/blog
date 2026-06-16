---
"description": "While reading an old — unpublished, for now — essay of mine, I was reminded of the wonderful book by Robert Persig titled _Zen and the Art of Motorcycle Maintenance_. The book serves to help anyone in any profession, but I think it speaks particularly well to the lives of open source maintainers."
"pubDate": "Fri, 12 Jun 2026 20:22:20 GMT"
"keywords":
  - "Book"
  - "Open Source"
"image": null
"featured": false
"draft": false 
---

# Zen and the Art of Open Source Maintenance

This blog post will not be as long as I wish it to be.
I do not have the time nor the patience at the moment to dive as deep into this subject as I feel the subject itself deserves.
It also will not be as short as I wish it to be.
It takes time to determine what is important and what is not.
My hope is that by declaring this essay "incomplete", you will grant me some grace and understanding.

While reading an old — unpublished, for now — essay of mine, I was reminded of the wonderful book by Robert Persig titled _Zen and the Art of Motorcycle Maintenance_.
I read it in high-school, and it has served as the foundation of much of my worldview up to this point.
The book serves to help anyone in any profession, but I think it speaks particularly well to the lives of open source maintainers.
Here, I hope to reflect on its teachings and find ways to apply them to the daily routine of open source maintenance and development.

If you have not read the book yet, please do so now.
I am not kidding.
Stop reading this blog post, walk down to your local bookstore and purchase a copy. 
Do not come back until you have read it.

## For The Disobedient

Since I suspect many of my readers to be rebels, or otherwise feel repelled by great literature, I will provide a brief overview of the book.

_Zen and the Art of Motorcycle Maintenance_ is not, as you may have guessed, actually about motorcycle maintenance.
Although it contains some valuable tips for those willing to get a little greasy, the book is really about how we perceive the world and how to navigate it without going insane.

Structurally, it follows Persig on his fictional motorcycle trip across the country.
Much of the book happens in conversation with himself while he rides down various roads and highways.

While I will save discussion of the more important matters for a later day, there is one section that needs explanation: Persig's __gumption traps__.

What is a gumption trap?
A [gumption](https://en.wikipedia.org/wiki/Gumption) trap is something that saps your motivation for a project.
In the book, Persig described them in the context of — you guessed it — motorcycle maintenance, but gumption traps lie everywhere in day to day life, especially for open source maintainers.
He describes two types of gumption trap: setbacks and hang-ups.

A setback is any gumption trap that is not, for lack of a better word, your fault.
It's when something that exists outside of your control impacts your ability to get sh*t done.
For an open source maintainer, supply chain attacks and — god forbid — GitHub outages count as setbacks.
They can often feel outside of your control. 
That feeling is what drains your gumption.

The good news is realized that there are things you can do to prevent setbacks, like locking your dependencies and avoiding GitHub.
Planning ahead, even if it's hard, can preserve your gumption for the really __fun__ parts of open source maintenance.

A hang-up on the other hand, is a more complicated kind of gumption trap.
Hang-ups happen internally, and are counterintuitively more difficult to move past.
They sap your desire to continue work on your project not because something terrible happened, but because there's something wrong with the way you view the world.
Persig says there are three important kinds of hang-up: value traps, truth traps, and muscle traps.
I do not think truth traps or muscle traps are particularly relevant to my work as an open source maintainer, so I will be assigning interpretation of those as homework for my readers.
Value traps, however, are quite relevant, so I want to go into those in detail.

### Value Traps

A value trap comes up when some aspect of your value system comes into conflict with the project itself.

Stubbornness can stop you from seeing a __good__ solution to a problem because you are too focused on a __bad__ solution.
Spending a lot of time working on a bad solution only see it as it is retroactively is a recipe for frustration and, of course, lost gumption.
The solution here is to slow down.
Spend time looking around the project and make sure all of your assumptions are correct.
For open source maintainers, this second look does not necessarily have to be at the code.
It can also be a look at the people around the code.
It's tempting to believe that you are the only one who can solve each problem.
In reality, there's likely a community of people working with you. 
Maybe a member of that community has insight you do not have.
Talk to them.

Boredom can make you sloppy, and sloppy work is bad work, and bad work steeps the gumption right out of you.
What's worse is that boredom often comes __after__ you have already lost much of your gumption.
This variant of value trap is absolutely not specific in any way to open source, so I will not pretend to connect the two.
Persig recommends taking a rest and getting plenty of sleep.
Whatever you do, he says, do not keep working.
Personally, when I encounter this gumption trap, I try to work on another "project" within my open source project.
Maybe I am not interested in debugging at the moment, so I swap over to writing a new module instead.
I can come back to my debugging task later with a fresh perspective and a full tank of gumption.

Anxiety, perhaps better characterized as _fear_, can stop you from doing anything at all.
I often get anxiety merging PRs, even after I have done all of my due diligence and truly believe them to be ready.
There is something about hitting "merge" that spikes my adrenaline.
But, [code ages like milk](./code_ages_like_milk), so I must merge it anyway.
Persig suggests you do extra due diligence if it makes you feel better.
If that does not help, just man up and do it.

## Conclusion

The wonderful thing about all the gumption traps that Persig highlights is that they are fundamentally in your control. Some can only be prevented, and others require some level of introspection, but they all can be managed.
Now seriously, if you did not listen the first time: go read the f**king book. Do it.
