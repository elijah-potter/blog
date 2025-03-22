# 3 Traits of Good Test Suites

As evidenced by my previous posts on [LLM-Assisted Fuzzing](https://elijahpotter.dev/articles/LLM_assisted_fuzzing), I've been dedicating a lot of my mental bandwidth to maintaining a low false-positive rate while we improve [Harper's rule coverage](https://github.com/automattic/harper). Part of that is through fuzzing and dogfooding, some can be through statistics, but the first lines of defense will continue to be unit and integration testing. This past week particularly, I've been reading up on how other [big linting programs](https://github.com/rust-lang/rust-analyzer) approach this problem.

## 1. Test Features, Not Code

I often ask myself: am I spending more time thinking or talking about the thing, or am I spending more time doing the thing? I've personally seen how projects fall into decline because their leaders are more interested in planning than doing.

In the context of software testing, this mantra is transformed into "test features, not code." To my eye, good code is flexible and self-explanatory. Tests that hook deeply into application or library internals make code less flexible and harder to read.

I especially like Alex Kladov's heuristic for this: the neural network test.

> "Can you re-use the test suite if your entire software is replaced with an opaque neural network?" - Alex Kladov

It's not a question of whether a neural network would pass the test suite, only whether the test suite could work for it. If the answer is no, the tests are likely testing code, not features.

## 2. Performance

The speed at which you can build and run tests (unit, static, integration, etc.) is a force-multiplier for everything else. You can validate ideas sooner, run CI faster, and get contributors on-boarded in less time.

Our goal to be fast at runtime dovetails quite nicely into this, so it's something Harper already does quite well. Moving forward, we need to make sure that we don't rely on any kind of IO in our tests, since that continues to be the slowest part of most Harper integrations.


We can simplify programs like Harper down into a single function which consumes text and returns a list of observed problems.


```rust
fn harper(text: String) -> Vec<Lint>{
    // Implementation details...
}
```

Most testing we are interested can be done with assertion functions that declare what qualities the output should have with a specific input.

For example, we have a function called assert_suggestion_result, which runs a grammatically incorrect string through Harper, applies the first resulting suggestion and checks whether the edited string matches a given value.

```rust
/// An example of a test that uses assert_suggestion_result
#[test]
fn catches_less_then() {
    assert_suggestion_result(
        "I eat less then you.",
        ThenThan::default(),
        "I eat less than you.",
    );
}
```

It's also vital that these assertions show good, readable error messages when they fail. Each time I've improved their logs, I get unprompted positive feedback from contributors.

Moving forward, I'd like to create a more diverse array assertions like this, as well as better-document their use. A lot of the current back-and-forth for rule contributions is related this.

## Wait! I Disagree

I hope someone does. Good test suites are something I'm continuing [to learn how to build](https://automattic.com/creed/never-stop-learning/). I understand that a lot of what I've said here doesn't apply to other kinds of applications or codebases. If there's nuance I'm not covering here, let me know!</p>
