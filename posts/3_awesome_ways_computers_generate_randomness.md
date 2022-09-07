
## What Is Randomness?

In case you were born yesterday, let's go over it.

Randomness is, as the basic level, something that cannot be predicted. In computer science, when we talk about randomness, we are usually talking about random numbers and the tools we use to get them, random number generators (RNGs).

## Psuedorandomness

We say an RNG is “pseudorandom” when we have to give it a fixed seed, and it generates random numbers based on that seed. If we give it the same seed, we will get the same numbers. It is deterministic.

I thought, for a very long time, that computers could only create pseudorandom numbers. The main reason I thought this, and why you might too, is because utilities like the Random class in .NET are pseudorandom and are seeded by some arbitrary information, like the current time.

Computers aren’t useful if they aren’t deterministic. I a perfect, enclosed system, it would be impossible for a computer to generate truly random numbers.

## True Randomness

The phrase “true randomness” is used to describe things that are impossible predict. Provably so. This is different from chaotic systems, which are predictable under short spans of time. True randomness is impossible to predict on all scales.

## The Everyday Method

Allow me to introduce you to [RDRAND](https://en.wikipedia.org/wiki/RDRAND) and [RDSEED](https://en.wikipedia.org/wiki/RDRAND#RDSEED), two CPU instructions originally introduced by Intel, that allow programs access to truly random numbers. These instructions gather data from an on-chip entropy source to provide random numbers.

These instructions utilize thermal noise to produce white noise, which is used to generate said random numbers. The advantage of thermal noise is that it produces actually random values, as explained here. It’s also fast, which means it can be used for everyday things, like generating SSL or TLS keys and the like.

### Do It Yourself

If you happen to be on a Linux system, you can actually use these instructions yourself. Just run this command:

`dd if=/dev/random count=4 bs=1 status=none | od -An --format=dI`

This command uses `dd` to generate 4 random bytes. Then it pipes those bytes into `od` , which will format those 4 bytes into human-readable text as a signed 32-bit integer.

## The Nuclear Method

One of the big advancements of the 20th Century was the creation of a branch of research called quantum physics. One of the things we learned was that on the scale of individual particles, it becomes provably impossible to predict state. Every time a measurement is taken of a subatomic particle, it’s state changes randomly.

One way we could sample subatomic particles is by placing a Geiger counter next to a bit of radioactive ore. Because the whether an individual atom will decay at any given moment, we can know that the time between ticks of the Geiger counter is random.

## The Cloudflare Method

Cloudflare uses some especially interesting sources of entropy to seed its random number generators. One way is via lava lamps. In their lobby, they have a large array of lava lamps. There is a camera running a live feed of the lava lamps to their servers. There are two main sources of randomness.

**First**, the lava lamps themselves. The movement of even a single lava lamp, if we forget the second law of thermodynamics, is far too chaotic to predict. If we include the second law of thermodynamics, it becomes true randomness.

**Second**, the camera’s sensor’s noise. Thanks to the photoelectric effect the noise that appears on a camera’s sensor, however unnoticeable, is truly random.

By combining these two sources, you get a pool of truly random numbers ~60 times a second. If that doesn’t fit your needs, you can use those numbers to feed a cryptographically secure psuedorandom number generator (CSPRNG) to get as many as you want.
