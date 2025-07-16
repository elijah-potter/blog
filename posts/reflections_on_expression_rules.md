# Reflections on Expression Rules

Just like grammar itself, Harper is rule-based.
These rules can be written by human or machine, and usually take the form of a "phrase correction" or an expression rule.
You can read more about both in [my guide](./writing_a_grammatical_rule_for_harper).

In essence, an expression rule is a small, declarative program that seeks out specific cases Harper can be certain are grammatically incorrect.
For example, we know redundant modal verbs are always wrong:

```plaintext
We could give it try attempt.
```

## What's Great About Expression Rules

As the maintainer of the project, I need to read through a decent number of pull requests each week.
Depending on their complexity, this can be time consuming.
Because expressions are almost always written with the same five primitives, they make reviews way faster.
For many rules, I only need a quick skim of the code and to confirm they don't create false-positives.

In addition to typos, the primitives underlying expression rules were designed to check agreement and word-ordering errors.
To that end, there are a number of assumptions baked in.
This makes some kinds of rules harder to write, but also makes all expression rules exceedingly easy to memoize.

## What's Not-So-Great About Expression Rules

As I said before, expression rules were designed for a certain kind of error.
There are many grammatical or layout rules which hard difficult or downright impossible to define with an expression.

This normally isn't problem, since we can go about them in other ways.
On multiple occasions, however, I've seen potential contributors get frustrated at a perceived lack of flexibility.
We didn't make it clear enough that there were solutions _other_ than expressions.

## How Can We Improve?

Applying Amdahl's law, I think the most effective solution is to [improve our documentation](./writing_good_documentation), as I have been for the last week or so.

Beyond that, removing the need for boilerplate code and other causes of mental overhead (like registering our rules and waiting for a slow compilation process) might lower the perceived difficulty of writing new rules.
