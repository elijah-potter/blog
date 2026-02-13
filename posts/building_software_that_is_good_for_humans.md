# Building Software That Is Good for Humans

Earlier today, [the European Commission released a report](https://digital-strategy.ec.europa.eu/en/news/commission-preliminarily-finds-tiktoks-addictive-design-breach-digital-services-act) detailing their initial findings that TikTok's core recommendation algorithm is in breach of the Digital Services Act.
This is only the most recent episode in the extended saga where western governments try to regulate the Chinese company.
The various reasons and the methods they employ in this regulation are far outside of my domain of expertise, but the report got me thinking.
Why does so much of the software we use feel harmful?

There are few people who can report that an interaction with Microsoft Word, Teams, or TikTok has left them feeling empowered, healthier, or happier.
On the other hand, I can think of plenty of software that has left me feeling great.
What is that?
How can we make sure our software sits in the latter group?

## Traits of Offensive Software

There are a few fundamental things that I've found make using certain software feel like a chore.
Software feels "icky" when it is some combination of slow, unpredictable, or when it gets in the way of the meaningful pursuits in life.

### It Is Slow

Computers are fast.
People understand that.
So if they're left waiting for a page to load or a process to finish, they feel frustrated.

Slow software makes it difficult to iterate and experiment.
Imagine if WordPress took 20 minutes to publish a post, only to discover afterward that you left a typo in the title.
That would be pretty frustrating, no?

Steve Jobs imagined Apple Computers to be "bicycles for the mind."
A bicycle whose chain hitched or whose steering lagged not be very helpful. It might not get you to your destination at all. 

I think that this idea of slowness is especially important in regards to AI agents.
If an assistant spends even a few seconds more than what is critically necessary for the query, and they're messaged frequently (say, to iterate on a blog post), users can quickly get tired or "brainrotted", as the kids say.

### It Is Random

If some software works _sometimes_, but not always, there's a good chance it's addictive.
This presents most obviously in apps like TikTok, but it also appears in more insidious places.
The inference of large language models involves randomness in its very nature.

Fundamentally, this from of addiction comes from a quirk of human psychology.
Randomly applied rewards (the software _sometimes_ works, but not always) is a form of [operant conditioning](https://en.wikipedia.org/wiki/Operant_conditioning).
It feels good to roll the dice, which makes us want to roll it more often.
Over time, rolling the dice starts to be less of a choice, and more of a habit.

When someone chooses to use software not because it's genuinely helpful, but because it feels good to roll the dice, a sense of agency is lost.

In my experience, Microsoft Word is like this, as are most agentic coding tools and image generators.

### It Distracts from That Which Makes Life Meaningful

When software is slow, or otherwise removes your agency with variable reward systems, it can start to chip away at your ability to make reasonable decisions on where to spend your time.
People who use "social" media sites like Facebook or Instagram can attest to this.
They simply don't feel like they have agency over their own actions anymore.
They can't stop using software they actively hate.

## Our Goals

I think that one of [Automattic's](https://automattic.com/) greatest strengths is that none of our software does any one of these things.
I remember the first time I used Pocket Casts: I was thrilled.
It was easily the best podcast software I had ever used.
The same things happened with Day One and WordPress.com.

As we look to building Harper, I think it's important that we remember these core principles.
Our software should be fast, predictable, and support our customers in finding meaning in their lives.
