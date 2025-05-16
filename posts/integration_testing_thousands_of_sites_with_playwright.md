# Integration Testing Thousands of Websites with Playwright

As I've accounted and discussed in previous posts, one of the hardest problems [Harper faces](https://github.com/automattic/harper) is that of the great diversity of the internet. There are a great variety text editors on the web, each used in a different context. That's a beautiful thing, but unfortunately our users expect Harper to work in all of these places seamlessly. I suppose you can view this post as a third part in this series where I talk about supporting thousands of websites for potentially millions of users (with zero server costs, I might add).

This journey started in Discord (as many do), with a satisfied user reporting an issue. I'm quite fortunate: they were technical. They're report was detailed and included some initial speculation on what the root cause could be.

![A small part of a larger conversion about the problem at hand.](/images/why_so_serious_screenshot.png)

While the actual underlying problem was complex and difficult to fix, that is not what this post is about. It is about Harper's strategy for doing end-to-end testing on the many sites we support.

It's relevant because this was a problem that could have been discovered through end-to-end testing. Since we have a diverse set of users already, they found the issue swiftly. That is far from ideal. Our testing suite should catch these problems _before the PR is merged._

## Why Playwright?

"[Playwright](https://playwright.dev/) enables reliable end-to-end testing for modern web apps." At least—that's what their site claims Playwright can do. I'm not sure if it lives up to this claim of reliability, at least not yet.

The decision to use Playwright over alternative choices came down to a few key points:

- It's quite polished and well supported (Microsoft seems to be the main player).
- While it is more complex to load a Chrome extension in Playwright than Puppeteer, I am also given a lot more control.
- We're already using it for other integrations (but not for end-to-end tests).

## The Game Plan

My goal is to build up a comprehensive-enough test suite that I can catch integration problems in foreign text editors before I merge PRs for logic that interacts with them.

Step one was to get Playwright installed and running on my machine, reproducible with npm. Fortunately for me, this was as simple as: `pnpm create playwright`. Step two was a little more complex: get our extension loaded within the headless browser. I found this could be done by overriding Playwright's default Chrome properties, instructing it to only install the Harper plugin and nothing else:

```typescript
export const test = base.extend<{
	context: BrowserContext;
	extensionId: string;
}>({
	// biome-ignore lint/correctness/noEmptyPattern: it's by Playwright. Explanation not provided.
	context: async ({}, use) => {
		const pathToExtension = path.join(import.meta.dirname, '../build');
		console.log(`Loading extension from ${pathToExtension}`);
		const context = await chromium.launchPersistentContext('', {
			channel: 'chromium',
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`,
			],
		});
		await use(context);
		await context.close();
	},
	extensionId: async ({ context }, use) => {
		let [background] = context.serviceWorkers();
		if (!background) background = await context.waitForEvent('serviceworker');

		const extensionId = background.url().split('/')[2];
		await use(extensionId);
	},
});
export const expect = test.expect;
```

From there, it was pretty trivial to build out assertions and tools for interacting with basic elements for the specific text editor I was interested in ([Slate](https://www.slatejs.org/examples/richtext)).

## The Cool Part

Most text editors on the web advertise themselves in the DOM, usually with a special attribute like `data-lexical-editor="true"` or `data-slate-editor="true"`. This even happens on world-class sites like LinkedIn or Instagram. I wonder if I can use this for something?

I believe this consistency in production code is intentional. Making our tests easier to write must be a side-effect of making the editor author's tests easier to write.

This is great news for me. With just a few tweaks, I can use the same code to test Harper on Discord, Medium, Notion, Desmos, Asana—you get the point. Since they use just a small set of rich text editors (which come pre-tagged), I can generate automated tests to determine whether Harper works properly on their sites.

## The Not-So-Cool Part

The bad news: this process is slow. Each page must be fetched from the network and operated on like a user. We might be able to fix the first problem, but the second is interminable. My initial experiments put the runtime of each test case around thirty seconds. If I'm testing hundreds or thousands of sites, this is a real problem.

For the time being, I'll have these tests be their own workflow in GitHub Actions and only run them when the extension code changes. I don't see people other than myself messing with this code too much, so I am not worried.

## What Does Testing Thousands of Sites Look Like?

I'll admit, I'm not quite to the "thousands of sites" territory just yet. The most frustrating part is getting started. Now that I've got a couple of sites under my belt, with the tools ready and able , the next thousand will be a lot easier.
