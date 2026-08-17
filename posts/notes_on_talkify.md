---
"description": "Research into the Talkify app, and whether speech-to-text might be a valuable addition to Harper."
"pubDate": "Mon, 17 Aug 2026 14:13:39 GMT"
"keywords":
  - "Harper"
"image": null
"featured": false
"draft": false
---

# Notes on Talkify

Matt recently asked me to take a look into [Talkify](https://x.com/tornikegomareli/status/2088524464224919700), which is a native macOS app in the same vein as [Superwhisper](https://superwhisper.com/).

The key differentiator between Talkify and its competitors is speed.
Talkify uses the existing speech-to-text models that Apple ships on its devices, which are naturally well-optimized for the hardware available.
These models are fast, so Talkify is too.
According to their website, they are as much as an order of magnitude faster than their slowest competitor.

I find Talkify's product offering somewhat confusing.

## Native macOS Support

The bit that I find most puzzling here is that there is already native support in macOS for the exact speech-to-text model that Talkify uses.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/dz7ZNN0srGk?si=c26SYYKa-dY2IDN8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

macOS even includes the ability to configure hotkeys out of the box.
Why would anyone use Talkify if there is a native way to accomplish the same task?

## The UI

The macOS setup is difficult to find and it's frankly ugly.
It lacks visual flair.
Talkify fixes this.
It takes that same great model and wraps it in a prettier UI that makes the whole experience more satisfying.
Is this valuable? Yes!
If a UI with a great model sucks, it makes a ton of sense to rewrap it.

## Can Harper Do It Too?

Yup! 

There is absolutely no reason we couldn't take advantage of the same technology Talkify uses.
There is a reason there are literally dozens of these text-to-speech apps.
They are quite easy to build.

## But Should We?

I do not think we need to add speech-to-text to Harper Desktop, or any other integration. At least not yet.

The biggest reason is that it is a pretty big maintenance burden.
If we rolled out speech-to-text as a core part of Harper Desktop, our users would expect to see similar feature sets in other places.
Even if adding text to speech would be easy on macOS, it will likely be pretty hard to do on _every_ platform that Harper supports.
Each platform might be easy, but the sheer number of platforms makes things difficult.
In the interest of doing less, better, I don't think this is an avenue we should be exploring yet.

On the other hand, if the Harper offering begins expanding to be more than just grammar and style checking, and instead towards a fuller suite of tools, we could totally include high-quality speech-to-text as part of that.
If anything, I believe this is a lesson in the value of a satisfying UI.

I am posting my thought process publicly on my blog to hopefully find out if any existing Harper users would be interested in such a feature.
Would the value of speech-to-text in Harper be greater than simply installing Talkify and Harper at the same time?
