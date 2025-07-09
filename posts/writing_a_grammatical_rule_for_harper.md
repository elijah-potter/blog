# Writing a Grammatical Rule for Harper

[Harper](https://writewithharper.com) is a grammar checker that relies on concrete, legible grammatical rules.
In doing so, we make Harper's inner-workings fundamentally clear, which allows us to guarantee privacy, speed, and most importantly remain __impartial__.

Writing additional rules is one of the best (and ___easiest___) ways you can contribute to the open source project.
Simple rules take just a few minutes and often don't require any understanding of Rust at all—a fact I only cite because it is a common point of concern.

Instead of throwing a wall of text in your face, I'm breaking this "guide" of sorts into three simple sections.
You don't need to read all three—in fact, I would recommend against it.

The only thing you need from here is an idea of the grammatical rule you want to add to Harper.
Don't have one in mind?
Visit our [issue board](https://github.com/Automattic/harper/issues?q=is%3Aissue%20state%3Aopen%20label%3Aenhancement%20label%3Aharper-core%20label%3Alinting) to find a potential rule that piques your interest.

The three paths:

1. [A "phrase correction"](./writing_a_phrase_correction_for_harper). These are for the simplest grammatical rules. Use one of these in cases where semantic meaning and context aren't important.
1. [An `ExprLinter`](./writing_an_expression_rule_for_harper). These are for more complex rules. Use one of these in cases where semantic meaning or context __are__ important, and you don't need access to information wider than clause-level. Takes a little bit to learn, but are extremely powerful. 
1. [A plain `Linter`]. These are often used for rules that involve punctuation. It requires the most Rust knowledge but the least Harper-specific knowledge.

These guides will focus more on the process of writing a rule for Harper, not the technical details of wiring it up.
For the latter, see our [official documentation.](https://writewithharper.com/docs/contributors/author-a-rule)
