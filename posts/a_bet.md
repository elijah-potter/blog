---
"description": "From 2020, when the 3090 launched, to 2025, when then the 5090 launched, we have seen a ~40% reduction in price per GFLOP/s year over year."
"pubDate": "Fri, 27 Nov 2026 22:26:51 GMT"
"keywords":
  - "Harper"
"image": null
"featured": false
"draft": false
---

# A Bet

The number of FLOP/s (floating point operations per second) available to be owned by the average consumer has been skyrocketing.
It seems to be growing at an exponential rate, not unlike the famous Moore's Law.

The RTX 3090 debuted in September of 2020. 
Back then, it seemed to be a monster of a GPU.
It was capable of 142 teraflops per second of throughput.
At its launch price of ~$1500, that was as much as 94 GFLOP/s per dollar spent.

Five years later, the 5090 launched.
It cost a bit more at around $2000.
But at the same time it offered as much as 1.6 _petaflops_ of power.
That is about 838 GLOP/s per dollar or as much as 88% cheaper.

We are seeing astonishing reductions in the cost of matrix multiplication on consumer hardware each year.
From 2020, when the 3090 launched, to 2025, when then the 5090 launched, we have seen a ~40% reduction in price per GFLOP/s year over year.
Moore's Law, eat your heart out.

That has dramatic implications for any organization that depends on floating point performance on consumer hardware. 
That includes Harper.

![Peak computational performance per dollar at different precisions, from Epoch AI.](/images/gpu_cost.png)

I argue that the best bet for a product like Harper is to assume that floating point throughput will continue to get cheaper over time at a similar rate to what we have been seeing for the past few years.

## Our Limit

For the uninitiated, Harper is grammar checker that is designed from the ground up for efficiency and privacy.
Unlike most other grammar checkers, Harper does all of its work offline, so there is absolutely no need to worry about the security of the things you write with it.

Great, right? 
Not so fast.
There's a barrier that limits how well Harper can do its job.
To put it plainly, our limit is that Harper needs to fit on user devices and consume as little power as possible while it works.

<!-- To develop Harper, we use machine learning to teach models what correct grammar looks like. Beyond that, we teach models how to transform improper grammar to correct grammar. -->
<!-- We also train models to do all sorts of other transformations on your text. -->
<!---->
<!-- We train models to do these things directly so that we can precisely control hallucinations. Your writing should remain yours, so our models are trained from the ground up to retain your voice and never to insert themselves into your thought process. -->

Harper relies on a series of language models to do its work.
If you know anything about Chinchilla scaling laws, you will know that the larger the model, the better it tends to be.
On the other hand, the larger the model, the more power it uses. To avoid using too much of our users' power, we deploy deliberately small, targeted models to do Harper's work.

We can crudely model power usage with the following equation, where $P$ is the power use in watts, $M$ is model size in parameters, and $E$ is the efficiency of the user's hardware. 
$E$ can be measured in FLOP/s per watt-hour. 

$$
P = \frac{M}{E} 
$$

Harper, due to the assumed lifestyles of our users, must keep $P$ below a certain level, which we can express as $P < \theta$.
In other words: We do not want Harper to drain the batteries of our users' laptops as they go about their day.
That is our limit.
To remain below our limit, we must either make $M$ very small or hope $E$ to be very large.
Right now, $E$ is not so large, so we must keep our models small.

## The Bet

In the introduction above, I highlighted a 40% reduction in cost every year in some of the more expensive GPUs available in consumer laptops.
We see similar patterns in lower end devices, too.
Intel, AMD, and Apple have all been juicing the throughput available on their integrated graphics cards.
These are chips available in sub-500 dollar laptops.

Harper's bet is this: The quality of grammar checking we can offer per watt of power is at least proportional to the cost per FLOPS/w of cheap laptop hardware.
As laptops are capable of more efficient inference, Harper will be able to offer better and better service, since we can simply increase model size.
In reality, I expect our service quality to improve much faster than that, since we will also be iterating on our model architecture and training regimen.

So while cloud models for grammar checking are currently the best in the business, it is easy to project forward and imagine a future where Harper's models meet or exceed those available in the cloud, without the security cost.
Plus, consumers will be able to use the hardware they already own.

## Imagine

Imagine the best grammar and style checking available today.
Now imagine it running entirely on your laptop, sipping power.
No concern that any company is training on your work, and no worry about a bad actor exfiltrating your data.
This will be possible thanks to Harper and the fast advances in chip technology we are seeing today.

Today, we can offer _good_ grammar checking within our power budget.
Tomorrow, we can offer _great_ grammar checking within the same budget.
