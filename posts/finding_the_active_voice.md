# Finding the Active Voice

Last week, Harper hit a stroke of luck.
It was featured on [MakeUseOf](https://www.makeuseof.com/stopped-paying-for-grammarly-once-found-free-open-source-alternative/).
The downstream social media posts collectively garnered nearly 300,000 views and drove a significant amount of traffic to our site.
This all happened in the wake of LanguageTool shutting down the free edition of their software.
These two events compound to bring more attention than ever to Harper — which is amazing.
It means our mission and values are resonating with people, which is always a good thing.

Reading the MUO article, we hear a lot of great things about Harper.
We also hear that "it skips many of the premium bells and whistles of Grammarly".
The author goes on to explain that the privacy Harper provides more than makes up for any missing premium features, but the point is clear: those features are deeply desired.

So, the question becomes: Which of Grammarly's features should we work on first, and how?

## The Active Voice 

I propose that we should focus first on helping our users find [the active voice.](https://en.wikipedia.org/wiki/Active_voice)
For context, the active voice is the style of writing where subject of the verb in a clause is the doer of the action.
This is in contrast to the passive voice, which is where the subject is the receiver of the action.
For example: the sentence, "The postal carrier was bitten by the dog" is written in the passive voice, while the equivalent sentence, "The dog bit the postal carrier." is written in the active voice.

Text written in the active voice is commonly viewed to be more authoritative, confident, and easier to understand.
Being able to help users use the active voice is one of the most commonly requested features in Harper, and including the feature would be a huge step towards competing directly with Grammarly Premium.

How should we go about helping our users with their active voice?

### How It Could Be Done

I spoke briefly with [Matt](https://ma.tt/), and we agreed that a two tier solution would be best.
A fast algorithm or model would _detect_ instances of the passive voice, letting a larger more computationally expensive model generate a modification in the active voice.

Fortunately, there is already extensive literature on the detection of the passive voice.
In particular, I found the [PassivePy paper](https://psycnet.apa.org/record/2024-13824-002) stimulating.
In fact, we can implement their ideas quite easily using the [Weir language](https://writewithharper.com/docs/weir) already baked into Harper.
I have done so in a private branch. It turned out to be ~20 lines of code. 
That is pretty good bang for the buck!

The second piece, which has to do with the actual simplification of text and conversion from the passive voice to the active voice is a tad more complex.

Matt and I agree that it will require the use of a larger language model.
The trouble is that it cannot be __too__ large.
Harper's shtick is that it is fast, private, and that everything runs directly on our user's devices.
That means whichever model we use for our style transfer will need to be relatively small.

I believe the best solution to this problem is to take an off-the-shelf model, like one of Google's T5 models, and fine tune it for the specific types of style transfer we need.
These are relatively small models (quantized, they can fit into spaces under 65 megabytes) and they run quite quickly, even on older hardware that doesn't have access to matrix multiplication accelerators.
There is prior art for running this at 50 tok/s in Chrome _without WebGPU_ on a single core.
The best part is that they're under the Apache-2.0 license!

## How This Fits in with the Weirpack Project

These models are small, but they're not quite small enough to be a part of the standard distribution of Harper.
I believe this should be an opt-in feature, and the best way to do that is to expose the functionality via a Weirpack.
If you don't know what a Weirpack is, I highly suggest you read my [previous](https://elijahpotter.dev/articles/imagine-a-weir-marketplace) [blog posts](https://elijahpotter.dev/articles/imagine-a-weir-studio) on the subject.

Everyone who wants this additional functionality could just enable it in the marketplace.
This continues our goal to make Harper as customizable as our users want, while providing sensible defaults.

## What's Next?

Once we have the system in place to detect and provide suggestions for the active voice, we will be prepared to do other kinds of transformation, like for adjusting formality or tone.

I'm really excited about this project, and I can't wait to get started.
