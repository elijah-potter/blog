# The Status of the Harper Chrome Extension

Elijah! Elijah! When will we have a Chrome extension for [Harper](https://writewithharper.com)?

Although it's usually asked with a bit more panache, this is a question I've gotten a lot.
In fact, an author at Lifehacker [wrote about it just yesterday](https://lifehacker.com/tech/harper-offline-alternative-to-grammarly).

For the longest time, it was a project on the back-burner. 
Something I intended to work on, but was always passed up for more important things. 
It never saw the light of day.

Until now.

![The Harper Chrome Extension](/images/harper_chrome_ext.png)

## What is Harper?
...and why do I need its Chrome extension?

Harper is a grammar checker that respects your privacy.
All language processing happens on-device, no matter where you're using it.

For most of Harper's history, it has only been available in one of many text editors as a plugin.
With the Chrome extension, you'll be able to get high-quality grammar checking anywhere on the web.

## What's the Status?

I just marked the [Chrome extension PR](https://github.com/Automattic/harper/pull/1072) as "ready for review".
Here's what that means.

If you're willing to get into the technical brambles, you can compile and run it yourself.
That will continue to be the case until the Chrome Web Store reviews and approves our submission, which could take a couple of weeks.

When installed, it will be enabled for a curated list of website that I've personally reviewed to confirm work well.
If you want to try using the extension on another site, you will be able to adventure into the world of unexpected behavior by hitting the popup menu.

Importantly, it is working exceptionally well on any site using the Gutenberg editor.
I will be backporting a lot of this code to our WordPress plugin to improve the experience there.

### Will it Support Firefox?

As the PR stands today, the extension does not support Firefox.

I have list of things that should get done whilst waiting for the Chrome Web Store to approve the submission.
Firefox support is on that list.

## Any Questions?

If you've got questions for me about this, feel free to reach out via [Discord](https://discord.com/invite/JBqcAaKrzQ) or on [GitHub](https://github.com/automattic/harper).
