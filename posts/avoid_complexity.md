# Avoid Complexity

For as long as I can remember, I've told people that the real challenge of software engineering isn't writing code.
It isn't documentation or CI pipelines either. 
No, the biggest challenge in software engineering is managing complexity.

Think about it.
The typical software engineer is a single person on a vast team, writing and editing a system composed of hundreds, millions, or even billions of lines of code.
I find that intimidating.
How in the world are we supposed to build robust and reliable systems when facing such complex odds?

I worry that, in my fascination in the [novel](./LLM_assisted_fuzzing) [applications](more_transformation-based_learning) of machine learning we hear about on a day-to-day basis, I've gotten distracted from the beast of complexity.
I've allowed the Harper codebase to accrue tech debt.

I recently watched [DHH's keynote from Rails World 2025](https://www.youtube.com/watch?v=gcwzWzC7gUA).
While I definitely do not agree with everything he has to say, I believe he makes some poignant points about complexity.
Some things, he says, which we consider normal today would have been ludicrous ten years ago.
Somehow, with computer hardware faster than ever, we've arrived at a point where 20 minute CI runs are acceptable.
Where a deploy to production can take an hour and setting up a new environment can take days.

I want to change that—at least, for Harper.

While working on several smaller projects, I've been cutting the fat out of [the Harper monorepo.](https://github.com/automattic/harper)
That means removing unnecessary build steps, parallelizing individual CI jobs, and removing optimization flags that don't work.

Harper isn't at the 2005 standard yet, but I want contributing to be as easy as possible. 
Ideally, it shouldn't take more than five minutes to go from cloning the repo to committing code.
That starts with simplifying [the environment](https://writewithharper.com/docs/contributors/environment).

## Addendum

I just came across [this other blog post](https://digitalsociety.coop/posts/migrating-to-hetzner-cloud/) where they discuss achieving three times the performance for a quarter of the price by switching from 
a complex AWS setup to a bare metal Hetzner server.
Another win for simpler systems!
