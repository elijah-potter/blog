# What Blasterhacks Taught Me About Leadership

## The Beginning

Although it was several months ago, I remember it like it was yesterday.
It was what I would call a _dusty_ Colorado Friday.
The sky was overcast and the trees depressingly barren.
The air smelled of cow farts, which was typical when the winds changed, blowing in cold air from the beef farms in the nearby town of Greeley.
In my mind, this signaled snow.

I walked into the Green Center, the building in housing the opening ceremony of BlasterHacks, the hackathon run by the Colorado School of Mines.
I sign in at the entrance and walk down into the auditorium.

As I greeted my teammates, [Grant Lemons](https://grantlemons.com/), [Lukas Werner](https://lukaswerner.com/) and [Byron Sharman](https://b-sharman.dev/), I noticed the nervous smiles on their faces.
You know the kind, the smile with the inner eyebrows slightly raised, shoulders tense.
We were excited, but we also knew we had 36 solid hours of programming ahead of us.

After collectively downing several whole pizzas and listening to the rules of the competition, we made our way over to Labriola Innovation Complex, the hours-old manufacturing building the competition would take place in.

## The Plan

We brainstormed some ideas under the overcast sky:

- A Bennett Foddy-inspired battle-royale game where all the controls were `vim`-keybindings.
- A health insurance app that estimates the cost of *your* care at all local hospitals.
- An app that encouraged you to stand up and move every thirty minutes.

It was that last one that we all got excited about.
We imagined it to be social: at a random interval (which would average to thirty minutes), the app would simultaneously send out a notification to every user.
Should the user choose to participate in the StandUp moment, the app would guide them all through the same short workout activity.
Finally, the user had the choice to upload "evidence" of the workout, which could be a short caption about what they were doing, or a photo.

The idea of StandUp (as we would go on to name our project) was inspired simultaneously by [BeReal](https://bereal.com/en/), recent research in the detrimental health effects of remote work, and the use of social liability for comparatively more extreme workouts (Strava).

![The Feed page of standup after a user has posted](/images/screenshot_standup.webp)

Of course, most of this had yet to be nailed down yet, for we were just entering the Labriola Innovation Complex.
I remember asking myself if I would leave before the competition was over.
Although I was tired from the days classes and homework, I felt a drive to dedicate my whole self to this project.

## The Board

We sat down and created a new [git repository](https://github.com/grantlemons/blasterhacks2024).
That's when I started thinking about how we were going to organize our work.
I proposed we setup a KanBan board, a project management technique I had picked up at [Archytas Automation](https://archytasinc.com).

![Our KanBan board near the end of the Hackathon](/images/kanban_blasterhacks.jpg)

If you've never heard of--or used a KanBan board, here's the gist.
There are three buckets:

1. To Do.
1. Doing.
1. Done.

The second bucket is divided up by person, so in our case, it was really four separate buckets.
When someone needed something new to work on, they would go to the "To Do" bucket and select a new task (which in our case, was a sticky note).
They would place the task into their corresponding "Doing" bucket.
Once the task was done, they would move the sticky note into the "Done" bucket and repeat.

As a gag, we added an additional (superfluous) bucket: IDGAF.
If a task was unanimously deemed no longer important or relevant to the project, that's where we would put it.

So, we got to work.
We had decided to use [Firebase](https://firebase.google.com/), [SvelteKit](https://kit.svelte.dev/) and [Go](https://go.dev).
I started setting up Firebase, Grant started researching the notification service, Lukas started working on a circular status page and Byron started researching the Camera API.

As I look back at this moment today, I realize something important about all of these tasks that ended up benefiting us in the long term: they were all independent.
None of these original tasks relied on any other to get done.
We could work in parallel.
Down the road, this would change, but the fact that we were parallel at the beginning set us up for success.

## The Snow and the Crash

We kept working through the night, downing energy drinks and laughing as we worked. We got the important services and UI element up and running.
Around midnight, as my nose had predicted several hours earlier, it started snowing.

As the snowflakes grew larger and ever more fluffy, I felt the teams energy begin to dip.
We were encountering roadblocks, one-by-one, as our motivation waned and the threat of sleep became more prominent.

Then, someone in the main atrium (who, I don't remember) pronounced, "we are going outside."
We ran down the halls like children spreading the announcement, and soon enough, there were dozens of tired computer science students throwing snowballs in their jeans the t-shirts.

As I threw (and received) a number of snowballs, I realized something important: we were making an app about taking care of yourself physically, but had neglected to do so ourselves.
As important as the project may be, it won't get done when everyone is tired, muscles cramped, and unhappy.
To keep the momentum going, breaks are required.

As we filed back inside to warm our hands under tap water, I swore to make sure the rest of the team would take care of themselves--and each other.

## The Conclusion

The rest of the hackathon was uneventful.
We sat at our laptops, cranking out line after line of code.
We took breaks and slept when we were blocked by other tasks.

Although it was our first hackathon, we decided to run our project in the _advanced_ track, normally reserved for hackathon veterans.
It paid off, because we won second-place!

Look at us: haggard but satisfied.

![The team receiving our second-place win.](/images/secondplace_blasterhacks.png)
