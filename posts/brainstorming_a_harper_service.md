# Brainstorming a Harper Service

SaaS products are all the rage these days.
Historically, Harper has positioned itself as [local-first](./local-first_software_is_easier_to_scale), which many often view as anti-SaaS.
That is not the case.

I describe Harper as "local-first" because it is principally meant to be run locally, meaning that your data doesn't leave your device.
Privacy is one of our core beliefs, and being "local-first" is part of how we honor that.

Given Harper's position on privacy, discussion of a centralized service (running on a server) might seem strange.
Today, I want to explain why a centralized service is necessary, how we intend to tackle it as part of the open source project, and how it's existence will not stand to affect our users' privacy in any way.

## Why We Need It __Now__

User's despise false-positives in Harper's grammar engine.

We'll often make a modification, test it as much as possible internally, and release it, only for a user to discover false-positives on their college essay.
We've significantly reduced their frequency through techniques like [LLM-Assisted Fuzzing](./LLM_assisted_fuzzing) and [artificial selection](./harper_evolves), but they persist.

Far and wide, most of the time between when we get a bug report and when we get a fix into production is spent doing meaningless "paperwork". 
Reading through issues, writing boilerplate code for tests, and preparing pull requests take up a lot of time.
I want to upend this entire loop and find a simpler way to iterate on false-positives.

The first step in this process is reducing the overhead for users to report them in the first place.
Instead of filing an issue, I'd love for user's to be able to push a button have have all relevant context sent directly to our inboxes.
Not GitHub account required, no fuss.

Obviously, we won't be sending any information without clearly disclosing the precise data being sent from the client.

Since these reports will be in a structured format, we can bundle fixes into larger batches, reducing overhead (and potentially making things easier for LLMs).
The Harper project's ability to continuously and surgically improve our service is part of what sets us apart from our competitors.
It's rare for user feedback to have such a direct impact on Grammarly's core engine.

This is just the start. Once we've proven that we can maintain such a system for our users, we will move on to more ambitious goals.

## How We Plan To Make It Happen

I've had success with these technologies in the past, and believe they'll work quite well for our initial use-case, and scale quite nicely as the service becomes more capable.

### SvelteKit

Harper's website is already built using SvelteKit.
It works.
Why mess with success?

### Database: [SQLite](https://sqlite.org/index.html) with [Drizzle](https://orm.drizzle.team/)

On modern hardware, SQLite can handle tens of thousands of transactions per second.
Since Harper (as a rule) will place little load on the service per-user, I expect SQLite can service our needs for a long time.
When that time expires, Drizzle (an ORM) makes it trivial to move to a more robust database down the road (I imagine PostgreSQL).

For the moment, iteration speed is paramount. 
I want to move fast.
To that end, [James](https://j.cv/) and I have discussed hosting everything on a small VPS, and we agree it's the best choice.

### Auth.js

Authentication is not something anyone should roll on their own.
Auth.js is a proven solution that bundles well with Drizzle to building out user profiles, authentication pages, and everything in-between.
The needs of the project won't necessitate this right away.
When the time comes, using Auth.js (from my experience) will shorten the auth problem down from weeks to just hours.

## The Future

I'm thrilled that we're finally moving in this direction.
Being local-only has taken us far, but loosening the reins to be more simply "local-first" will allow us to tackle more interesting problems and provide more value to our users.
I can't wait to get started.
