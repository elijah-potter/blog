# Local-First Software is Easier to Scale

The title of this post is somewhat misleading. Local-first software rarely needs to be scaled at all.

[Harper](https://writewithharper.com) recently received a massive increase in both traffic and user count.
How?
By making it to the front page of Hacker News.
If you couldn't tell by the extent to which I talk about this, I'm thrilled.
This amounted to a tremendous amount of free advertising, if nothing else.

I've been thinking a lot about the wondrous benefits of working at the edge.
That's just one term of many that people use to describe Harper: "edge-first".
Others include "local-first" or simply "on-device".
They are all just jargon for a simple idea: We run all the relevant grammar checking code as physically close to the users as possible.
That way, we can serve up suggestions faster than anyone else.
To achieve our goal, we make sure that everything is well-optimized and lean.
Harper barely uses any CPU or memory at all.

What does all this mean in the context of the recent uptick in user acquisition? Imagine, for a moment, we are LanguageTool.
Our software is written in Java, with questionable attendance to the efficiency of our code.
Since our software requires a big server to run, we have a certain number of servers on standby to handle a certain amount of expected load.

If suddenly the number of requests we received were to double (as it did for the Chrome extension), we would be big trouble.
To avoid increasing the latency on requests (or dropping requests all together), we would need to scale up the number of running servers.
This not only takes hiring an expert in cloud architecture, but also additional funding to pay the AWS (or whatever) bill at the end of the month. 

Because Harper runs at the edge (no server required), we don't have to worry about that.
In fact, I only noticed that our user count had spiked after I visited Hacker News the morning after.
No hiccups at all.

Lots of cloud providers like to brag about being able to scale with their users. I like to brag about not having to scale at all.
