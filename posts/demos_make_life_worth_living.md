# Demos Make Life Worth Living

![The Bethesda Fountain in NYC](/images/bethesda_fountain.png)

The initial goal of any greenfield project of mine is to build a working demo. If possible, that demo should run on the web, so I can distribute to friends and family.

One of my first posts to hit the front-page of Hacker News represented exactly this philosophy. At the time, I was in high-school, taking an independent linear algebra class. I wanted to demonstrate exactly how the things I was learning could be applied to real-world problems. My blog post, ["Markov Chains are the Original Language Models"](./markov_chains_are_the_original_language_models) included an interactive (small) language model that readers could use to generate meaningless text. I gave them the ability to toy around with the training data to see how it could affect the final model's generations.

I ended up getting an "A" in the class and a couple thousand hits online. More importantly, I had proven the utility of a demo. Since then, [every](./building_a_software_render_engine_from_scratch) [major](https://github.com/elijah-potter/thrax-language) [project](https://writewithharper.com) of mine has had some kind of demo. Some of them better than others.

The Harper demo, in particular, was rough to start. It was enough to prove the concept and establish the project within a certain ecosystem, but it far from perfect. It had bugs and, until now, hasn't evolved with the project at all.

For all my projects though, I see the initial demo as critical. Beyond proving the concept, the demo gives me an enormous amount of motivation. As an engineer, there are few things more thrilling than to watch someone toy around with the product of your work. When there's a live version of your product available, any incremental improvement comes with a hit of dopamine.

I had a great discussion with [Adam Zielinski](https://adamadam.blog/) a few weeks ago, when he encouraged me to make the demo on the Harper website as close to the actual Harper experience as possible. Last week, I did exactly that.

Actually, I did more than that. Today, the demo isn't just similar to the experience of using our Chrome extension, it is exactly the same. The DOM-inspecting and manipulating technology found in the Chrome extension can now be embedded in any page. That includes the actual Harper website, and any other site you might want. 

For now, I'm calling this the [`lint-framework`](https://github.com/Automattic/harper/tree/master/packages/lint-framework), and it opens the doors to a good many other integrations (should we decide to build them). It is essentially a portable package that includes pretty much everything you need to provide Harper to any browser-based text editor. 

Many applications allow users to build plugins into their WebView, but don't provide the full web extension API (Thunderbird, for example). In these cases, we can pull in the `lint-framework` and wire up the native plugin APIs to build configuration pages. It isn't a complete solution, but it cuts down the work and maintenance overhead enormously.

As it turns out, the cruft of Harper's demo was a major barrier to adoption. Since polishing it up late last week, we're already seeing metrics like bounce rate move in a positive direction.
