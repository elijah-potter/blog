# Generating Weir Code with LLMs

As you know, I've been working on a small programming language called Weir for generating corrections to natural language.
For the curious, I highly suggest reading my previous blog posts on the subject if you haven't already.

- [Building the Weir Language](./building_the_weir_language)
- [Updates on the Weir Language](./updates_on_the_weir_language)

In one of those previous blog posts, I speculated that an LLM might be quite effective at generating these rules, especially if they are given access to tools that can validate and run tests.
Today, while writing some public documentation for the language, I did a bit of experimentation.
I wanted to know: Can an LLM simultaneously handle the complex challenge of understanding a [DSL's](https://en.wikipedia.org/wiki/Domain-specific_language) syntax, the semantics of the English language, and be able to validate its own work with tests?
More to the point: can it do a better job with a DSL than an established language like Rust?

For those who want to follow along at home, [here's the GPT](https://chatgpt.com/g/g-6945b952be148191a21d0189e0691a97-weir-writer) I've been toying around with.

### Some Experimentation

I often hear that one should avoid novel or exceedingly old programming languages when working with LLMs, simply because these languages aren't well represented in their training data.
Based on this hearsay, I didn't expect much going into this little experiment of mine.

First, I wondered if it could handle the trivial issue of correcting "as nauseam" to the correct form, "ad nauseam".
It's a common typo, and it should be pretty simple Weir rule.

My minimal GPT spit this out:

```weir
expr main (as nauseam)

let message "Did you mean `ad nauseam`?"
let description "Corrects the common typo `as nauseam` to the proper Latin phrase `ad nauseam`."
let kind "Typo"
let becomes "ad nauseam"

test "He repeated the point as nauseam." "He repeated the point ad nauseam."
test "This argument has been made ad nauseam." "This argument has been made ad nauseam."
```

That looks pretty good!
All the syntax is correct, and it even included some (passing!) tests.
Claude Code or Codex could do this using our existing Rust infrastructure, but it would have taken several minutes to churn out a valid result.
GPT 5.2 Instant was able to do this in a matter of seconds.
Not to mention that it didn't need a copy of the entire Harper source code.

I wanted to try a problem that was a bit harder to solve, so I asked it to address the problem of double-negatives.
After thinking for a few minutes, it came up with four individual rules that each address different cases.

```weir
expr main <(
  [(don't), (do not), (doesn't), (does not), (didn't), (did not),
   (can't), (cannot), (couldn't), (could not),
   (won't), (will not), (wouldn't), (would not),
   (shouldn't), (should not),
   (isn't), (is not), (aren't), (are not), (wasn't), (was not), (weren't), (were not),
   (ain't)]
  [$have, $get, $need, $want, $know, $see, $find, $say, $do]
  no
), no>

let message "Avoid a double negative."
let description "If the clause is already negated (e.g., `don't`), prefer `any` over `no` (e.g., `don't have any`)."
let kind "Usage"
let becomes "any"
let strategy "MatchCase"

test "I don't have no idea." "I don't have any idea."
test "She did not get NO response." "She did not get ANY response."
test "I have no idea." "I have no idea."
```

```weir
expr main <(
  [(don't), (do not), (doesn't), (does not), (didn't), (did not),
   (can't), (cannot), (couldn't), (could not),
   (won't), (will not), (wouldn't), (would not),
   (shouldn't), (should not)]
  [$do, $say, $see, $hear, $find, $know, $have, $get]
  nothing
), nothing>

let message "Avoid a double negative."
let description "If the clause is already negated, replace `nothing` with `anything` (e.g., `didn't do anything`)."
let kind "Usage"
let becomes "anything"
let strategy "MatchCase"

test "He didn't do nothing." "He didn't do anything."
test "I can't see NOTHING." "I can't see ANYTHING."
test "I did nothing." "I did nothing."
```

```weir
expr main <(
  [(don't), (do not), (doesn't), (does not), (didn't), (did not),
   (can't), (cannot), (couldn't), (could not),
   (won't), (will not), (wouldn't), (would not)]
  [$tell, $call, $see, $know, $say, $help, $find]
  nobody
), nobody>

let message "Avoid a double negative."
let description "If the clause is already negated, replace `nobody` with `anybody`."
let kind "Usage"
let becomes "anybody"
let strategy "MatchCase"

test "I didn't tell nobody." "I didn't tell anybody."
test "We can't find NOBODY." "We can't find ANYBODY."
test "Nobody called." "Nobody called."
```

```weir
expr main <(
  [(don't), (do not), (doesn't), (does not), (didn't), (did not),
   (can't), (cannot), (couldn't), (could not),
   (won't), (will not)]
  [$go, $run, $walk, $drive, $get, $look]
  nowhere
), nowhere>

let message "Avoid a double negative."
let description "If the clause is already negated, replace `nowhere` with `anywhere`."
let kind "Usage"
let becomes "anywhere"
let strategy "MatchCase"

test "She can't go nowhere tonight." "She can't go anywhere tonight."
test "I did not look NOWHERE else." "I did not look ANYWHERE else."
test "Nowhere is safe." "Nowhere is safe."
```

Again, I'm quite impressed. 
Obviously, it's hard to tell at first glance whether these rules would hold up in production for tens of thousands of users.
Nevertheless, these rules look correct, and my initial testing shows that they work.
The model was able to successfully apply more complex logic: the derivation syntax and the filter syntax.

In my original announcement blog post, I explained that the target audience for Weir were the members of large organizations that wish to enforce stylistic conventions or brand names throughout their workforce. 
To that end, I wanted to test an LLM against some of Automattic's nomenclature.
After reading though some of our public documentation, it come up with some admittedly useful rules:

```weir
expr main (wpvip)

let message "Use the official spacing for VIP."
let description "Expands `wpvip` to the official brand forms `WordPress VIP` or `WP VIP`."
let kind "Miscellaneous"
let becomes ["WordPress VIP", "WP VIP"]
let strategy "Exact"

test "This runs on wpvip." "This runs on WordPress VIP."
```

```weir
expr main (jet[-, ( )]pack)

let message "Use the official spelling `Jetpack`."
let description "Standardizes `jet pack` / `jet-pack` to `Jetpack`."
let kind "Miscellaneous"
let becomes "Jetpack"
let strategy "Exact"

test "Install jet pack for backups." "Install Jetpack for backups."
test "Install jet-pack for backups." "Install Jetpack for backups."
test "Install Jetpack for backups." "Install Jetpack for backups."
```

```weir
expr main (word[-, ( )]press)

let message "Use the official spelling `WordPress`."
let description "Standardizes `word press` / `word-press` to the product name `WordPress`."
let kind "Miscellaneous"
let becomes "WordPress"
let strategy "Exact"

test "I build sites with word press." "I build sites with WordPress."
test "I build sites with word-press." "I build sites with WordPress."
test "I build sites with WordPress." "I build sites with WordPress."
```

Again, I'm quite pleased.
With just a quick search of our website, it was able to discern what style we wished to enforce and wrote functioning Weir rules to do so.
I can see this being helpful at any number of business that communicate regularly.

### Conclusion

Overall, I'm quite pleased with how well these LLMs were able to write Weir code.
I've yet to finalize any documentation on the more complex parts of Weir's syntax (like our POS-tagging system), which means I haven't yet been able to test them with any LLMs.
Even so, I'm impressed.

I even tried it out on [Mistral's tiny and ultra-fast three billion parameter model](https://docs.mistral.ai/models/ministral-3-3b-25-12).
It performed almost as well as OpenAI's 5.2 Instant model, albeit without nearly the same level of creativity.
I think this somewhat proves that modern LLMs are able to generalize to novel languages, which makes them exceedingly useful for [DSLs](https://en.wikipedia.org/wiki/Domain-specific_language) like Weir.

I'm looking forward to seeing how people end up taking advantage of this.
