# Imagine a Weir Marketplace 

> For context, I maintain [an open-source grammar checker by the name of Harper.](https://writewithharper.com/)
> This post is a kind of RFC for a potential improvement to the project's ergonomics.

I've observed a high degree of specialization of language between academic fields.

Ecologists use bits of language that computer scientists don't use, and computer scientists use bits of language that ecologists don't use.
If we embrace this specialization through customization, we could gain an advantage over other grammar checkers.
That's all to say: We want to enable authors and academics to customize Harper to their specialized language.
For example, a chemist might want to enforce a set of rules for ensuring molecules are named correctly according to the IUPAC standard, and a science fiction author might want to enforce rules to make sure specific characters are addressed by the proper titles.
Weir is solution to these problems.

In this post, I'll recap what Weir is, and outline a mechanism for distributing Weir rules to individual users that might take advantage of them.
I'd love your thoughts on how we can make it as impactful and interactive as possible.

In [my initial post about Weir](./building_the_weir_language), I discussed how most large organizations have style guides which define specific rules for their employee's grammar, capitalization, and formatting.
I proposed a programming language by the name of Weir, which could be used to clearly state these rules to be enforced by Harper.
I've personally found that LLMs are not great at enforcing strict grammatical guidelines, but they're excellent at translating them from an existing style guide into the Weir language.
See [my recent experimentation for more details](./generating_weir_code_with_LLMs).

Now that Weir has been merged, we can move on to the other problems: creation and distribution.
Today, I'd like to talk about distribution.

I've had several discussions in the last week from people who want to be able to customize Harper with their own rules.
This includes people who use Harper as a part of their [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration), academics, and some engineers who work on learning management systems.
There is a need and desire for this today, and I want to address it as soon as possible.

## Distribution

Once a collection of Weir rules has been drafted, how should it be shared.
There is a formatting piece, as well as an infrastructure piece.

### Weirpacks

I propose a simple, but effective format for sharing collections of Weir rules.
Instances of this format should be called "Weirpacks" and thus have the file extension `.weirpack`.

Right now, the Weir rules baked into Harper are organized into a single directory, `weir_rules`, with each `.weir` file prefixed with the rule's name.
For example, the file containing the rule for fixing `Their` to `There` is `TheirToTheir.weir`.
There are a vast quantity of these "curated" rules, and I don't think they should go anywhere.
I just think we can reuse the layout.

I believe the best strategy for organizing collections of Weir rules is to replicate what's already in the Harper repository, but inside a [ZIP archive](https://en.wikipedia.org/wiki/ZIP_(file_format)).
Even though it is a ZIP file, which normally have the suffix `.zip`, I think we should give them the `.weirpack` suffix for clarity on their purpose.
The root directory of the archive will contain as many `.weir` files as is desired by the Weirpack author, in addition to a `.json` manifest file containing package metadata.

#### Metadata

Since JSON is quite flexible, Weirpack authors can include whatever information they want.
I think certain fields, however, should be required.
Namely:

- The Author's Name
- The Weirpack's version 
- A description of the Weirpack's purpose and usage
- The Weirpack's license

I think we can also recommend, but not require some additional helpful information:

- Keywords relevant to the rule's purpose
- The Author's Website

#### Loading Weirpacks

Support for Weirpacks will be baked directly into `harper-core`, as well as `harper.js`.

The former will make it possible for our command-line programs, `harper-cli` and `harper-ls`, to load them at runtime.
In `harper-cli`, which is a debugging tool, it will be sufficient to expose a flag on our `lint` command to allow Weirpacks to be loaded.
In `harper-ls`, we need to update our config to allow Weirpacks to be loaded from a directory on the disk. 
The default should be next to where the dictionaries are already loaded.

The latter will make it possible for our web integrations to load them when the user desires, either from disk or from our marketplace (more on that in a minute).
For both the Obsidian plugin, as well as the Chrome extension, we'll include a field in the settings menus for users to load Weirpacks from disk and into the linter.
Naturally, these will persist across sessions in the same way the other settings do.

Being able to load Weirpacks from disk is critical to allowing users to remain completely offline if they choose to be.
Additionally, loading custom Weirpacks without approval from a moderator is a prerequisite to having a quick and enjoyable iterative loop.

### The Weir Marketplace

When a user in a field with specialized language downloads Harper, we will naturally provide them with the essential rules that are common to the entirety of the English language.
We will also give them the option to download additional Weirpacks from the Weir Marketplace.
This will be a place, not unlike Obsidian's Community Plugins Marketplace, where user-submitted Weirpacks can be downloaded and installed quickly and easily.

![The Obsidian Community Plugins Marketplace](/images/obsidian_marketplace.png)

Imagine, if you will, that you're a JavaScript developer who has just downloaded Harper.
You start writing a blog post about your recent adventures with the latest JavaScript framework.
Unfortunately, Harper starts flagging swaths of your work as misspelled and filled with poor grammar.

Thankfully, Harper notices its mistake and offers to download a relevant Weirpack for programmers—one preset with a dictionary filled with technical language and rules to ensure proper use.
You download the Weirpack and continue writing with Harper now better equipped to handle the subject at hand.
Crisis averted.

### The Long View

This idea of a self-contained Weirpack providing the logic and the datasets necessary to do grammar checking for a specialized subset of English is intoxicating.
Projecting forward, I can imagine a future where we can provide support for any number of natural languages, distributed via Weirpacks and supported by a community of contributors in a decentralized way, not dissimilar to WordPress' plugin marketplace.
That isn't for today, though.
