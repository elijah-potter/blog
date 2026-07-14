---
"description": "A flaky test is any test for your code that only *sometimes* fails."
"pubDate": "Fri, 10 Jul 2026 20:46:48 GMT"
"keywords":
  - "Harper"
  - "Quality"
  - "Testing"
"image": null
"featured": false
"draft": false
---

# Dealing with Flaky Tests

For the past day or so, I have had my head down, tearing my hair out, trying to debug a significant block caused by many engineers' arch nemesis: a flaky test.
In my case, it's actually been several flaky tests.

A flaky test is any test for your code that only *sometimes* fails.
It shows up when a part of your test relies on something non-deterministic.
Non-deterministic components can include:

- Fetching resources over a network connection.
- Reading from a random number generator.
- Using a non-deterministic asynchronous scheduler.
- Animations (often use the GPU).
- …and many more.

If your application includes code that looks anything like these, you are at risk for flaky tests.

My use-case happened to be especially vulnerable to these, since our integration tests run against a wide variety of text editors.
[See my original blog post for more details.](./integration_testing_thousands_of_sites_with_playwright)

## Flaky Tests **SUCK**

It's hard to express how frustrating a flaky test can be if you have not experienced a bad one yourself.
In short, they slow development time, cause unintentionally brittle software, and they can create a lot of frustration for users, since the issues they allow into production are inconsistent.
They make all the effort put into producing tests, wasted.

Tests are designed to catch bugs before they get into production.
If a test expects certain behavior out of non-deterministic systems, these tests can pass locally and in continuous integration, but fail on a user's device.

This is a problem primarily for users, but also for developers.
It's good if a flaky test fails in CI.
After all, that is how you know it exists.
But it is very bad if a flaky test fails in CI and the original author of the test is no longer around.
In that case, it becomes difficult to determine which non-deterministic system is causing the failure, and thus how to fix the underlying bug represented by the flakiness.

## Prevention

The best way to get around flaky tests is to make it as difficult as possible to create them in the first place.

When I first started using [Playwright](./integration_testing_thousands_of_sites_with_playwright) about a year ago, I didn't think too much about its configuration.
Boy was that a mistake.

I really like [Omakase](https://en.wikipedia.org/wiki/Omakase) software, and I had (mistakely) assumed that Playwright was an example of it.
Thus, I assumed a default configuration for my project and let it be.
While Playwright is a phenomenal tool, I ended up being wrong.
The defaults I received from my project template were not optimal, and they would subtly waste a lot of my time over the next year.
You see, there is configuration for Playwright that can prevent most flaky tests from entering your code, and they aren't set up by default.

To avoid most issues, change these two settings:

```typescript
export default defineConfig({
    retries: 0, // Was 4 by default.
    repeatEach: 2, // Was 0 by default.
});
```

In my project, I added a small nudge to discourage people from removing these:

```typescript
export default defineConfig({
	/** Extremely important to avoid flaky tests. DO NOT CHANGE or I will kill you. */
	retries: 0,
	/** Extremely important to avoid flaky tests. DO NOT CHANGE or I will kill you. */
	repeatEach: 2,
});
```

I jest, of course.

What do they do?
They are pretty self-explanatory.
`retries: 0` will configure Playwright to *never* retry a test if it fails.
If it fails, it is reported as a failure and your continuous integration will stop, forcing a human to deal with it.
`repeatEach: 2` will run each test twice. A potential flaky test might pass on the first round, but is much less likely to pass twice.
Some flaky tests may still sneak through.
You may want to configure it more aggressively in some stages of your CI/CD pipeline.

I have noticed that AI agents are especially prone to producing flaky tests, since they will often simply run a test again and again until it passes.

## Debugging

As for debugging, I can provide no better advice than I typically do:

- Use a debugger.
- Use `git bisect` if necessary (or have an agent do it).
- Work slowly and methodically. Slow is smooth, smooth is fast.
