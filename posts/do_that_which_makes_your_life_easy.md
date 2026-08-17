---
"description": "Why it might work well to make decisions (while building or maintaining software) in the interest of your quality of life?"
"pubDate": "Fri, 14 Aug 2026 20:20:39 GMT"
"keywords":
  - "Harper"
  - "Getting Real"
  - "Jason Fried"
  - "DHH"
"image": null
"featured": false
"draft": false
---

# Do That Which Makes Your Life Easy

I have long been a fan of DHH and 37signals' various technical and social accomplishments.
With a relatively small team, they have laid the foundation for [a number of successful companies](https://gist.github.com/anildigital/8f4b7ba766597919951a20cc3acf8355) and maintained a community of extremely intelligent engineers who work with it.
I have long followed their work and have found a wealth of success applying their advice to my own practice.

[I recently read _Getting Real_](./getting_real), which was the first published book containing their advice for building a successful SaaS company.
I noticed that, throughout all of their written work, all the advice Jason Fried and DHH give have a deeply personal idea baked into them.
Whatever you do while building your business (or application), do it while setting yourself up to have a good quality of life.

My goal in writing this post is not to propose an appeal to authority.
My goal is to come to an idea of why it might work well to make decisions (while building or maintaining software) in the interest of your quality of life.
In other words, if you come to a fork in the road where a decision must be made between two or more options, you can often safely choose the one that supports your own (selfish) desire to improve your quality of life.

[In an older post](./neoengineers), I proposed another kind of mental shortcut.
When you imagine yourself on the path to being the kind of person you most admire, it's found (and this is supported by a number of psychoanalysts I have spoken to) that you tend to become that person, almost by accident. 
The example I offered was my own: When I must make a decision, I try to imagine what "the most effective engineer" would do.

This mental shortcut — choosing the option that improves your quality of life — can be used in tandem with that other shortcut.

## Dogfooding

[Eating your own dogfood](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) is perhaps the most obvious example of this idea of improving one's own quality of life.
When you are required — by force of will, or by necessity — to use your own product, the incentives align strongly towards making it better.
If you make a change, and it improves the quality of your own life, it's quite likely it will also improve the lives of your present and future users.

The obvious place dogfooding helps is in the search for bugs.
If you use your own software, you receive a representative sample of what the experience is like for the average user who consumes your product.
If _you_ encounter an obvious bug, you can guarantee that your users have seen it too.

## Which Feature Is Best?

When working on a new feature or capability, it is almost always better to prioritize the one that will most tangibly help __you__.

For me, this meant making Harper available in Discord.
At the time, I was already using Harper a TON in GitHub, and I had grown used to typing out a messy message fast and hitting `Ctrl+E` to fix all my mistakes.
This let me write code reviews faster, but I felt frustrated whenever I needed to collaborate with a fellow maintainer in Discord, since I had to type slower and fix my mistakes manually.
By adding Harper to Discord, I make my own quality of life better and introduced a core capability to my product that opened up a new market for potential users.

## Indirectly Helping Your Users

There are a wealth of situations where the decision to improve your quality of life is correct, even if it does not _directly_ improve the product experience for your users.

Consider your continuous integration (if you have it).
It may take a few minutes to complete, or it may take a few hours.
In either case, you probably do not like waiting for it to run.
Perhaps it has been demanded that you decide whether to (A) add a new highly-requested feature your product, or to (B) spend some time speeding up your continuous integration.

If you do not think that speeding up your continuous integration will improve your quality of life, I suggest that you add the feature instead (option A).
I have observed this is rarely the case.
I have found that most engineers spend a nontrivial amount of their time sitting at their desk, waiting for their GitHub Actions workflow to complete so they can free up mental space to work on other things.
If you have had that experience, speeding up your continuous integration (or even removing it!) might be the better choice.

The frustration of waiting for this *thing* to finish is palpable for a reason: It is slowing everything down!
Removing it as a constraint will allow you to get more done, faster, better, and you will be happier as a result.
What is there to complain about?!

## Still Use Your Brain

No matter how many blanket rules I or even the folks at 37signals throw at you, please use your brain.
Each decision should be considered with the effort it deserves. 
Sometimes a mental shortcut is enough, and other times you need to put some real gray matter to work.
Developing judgment for which situation is which is a difficult, but extremely valuable, skill.
