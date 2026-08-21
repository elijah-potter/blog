---
"description": "I am pleased to say, that Harper Desktop for Windows is coming along beautifully. To keep myself accountable, I am setting a hard beta launch date of August 28th."
"pubDate": "Fri, 21 Aug 2026 20:22:14 GMT"
"keywords":
  - "Harper"
  - "Windows"
  - "Desktop"
"image": null
"featured": false
"draft": false
---

# Harper for Windows

> _This is a follow-up to a recent post where I discussed the benefits of prioritizing Windows support for Harper Desktop. [You can read that post by clicking here.](./the_case_for_windows)_

I am pleased to say that Harper Desktop for Windows is coming along beautifully.
It is not ready yet, but I plan to launch it in beta soon.
To keep myself accountable, I am setting a hard launch date of August 28th.

If you are on macOS, you will be pleased to know that the macOS app is already out and ready for your feedback.

## Let's Take a Look

<video width="100%" height="400" controls autoPlay muted loop>
    <source src="/videos/windows_harper_demo.mp4" />
</video>

As you can see, we have the most critical steps working reliably.

- We can read text from an arbitrary application (in this case, Notepad).
- We can render highlights over that text.
- We can apply or dismiss suggestions at the user's discretion.

There are still some components that need to be debugged. Namely, we need to be able to _disable_ grammar checking in unsupported applications. Right now, if you open up YouTube or Paint, Harper will try to grammar check those images. Obviously, that is not desirable.
In the video, you can also see that Notepad's built-in spell checker can shove itself in front of Harper's UI. This is because of a race condition between Notepad and Harper. I intend to win that race before we release the software.

## Was Windows Easier than macOS?

Yup! And by a long-shot, too.

As I said before: Microsoft is extraordinarily more accommodating to developers than Apple is.
I have had a lot of beef with Apple over the years due to their hostile attitude towards the people who make software for their platform.

The Windows APIs we needed to interact with were:

1. Faster than the equivalents on macOS.
2. Better documented.
3. Simpler.

Something about the `win32` API makes me think that Microsoft has their head screwed on right.
It's always nice to see [my suspicions confirmed](./the_case_for_windows).

## What Is Next?

I will be working to refine the settings UI to better represent the Windows' setup process (spoiler alert: it's a lot simpler).
Plus, I think I will be backporting the same components we use for the Desktop settings menu to the Chrome Extension.

If you want to keep track of my progress, you can follow [this PR Stack in GitHub](https://github.com/Automattic/harper/pull/4174).
