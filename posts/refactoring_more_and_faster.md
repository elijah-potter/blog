# Refactoring More and Faster

![Clouds in Colorado](/images/clouds.webp)

I've been deep in the refactor rabbit-hole.
You know—that awful (but strangely satisfying) space where the majority of your commits are small pedantic edits that don't change the end-user-experience at all?

These past few weeks, I've been working so hard on Harper's Chrome Extension and building systems for transformation-based learning, I haven't had a chance to touch any of the actual grammar rules the software is supposed to fix.
As such, a few glaring tools for rule authors have gone unimplemented.
These are tools that—because they're so tied into the core system—need a lot of expertise and fine-tuning to work properly.

If you take a look at the [diff](https://github.com/Automattic/harper/pull/1393), you'll find that there are a lot of small edits.
Since each one takes a minimal amount of cognitive effort, it is easy for me to slide into a trance.
A trance where I am technically moving towards my goal (in this case, creating an expression system that encompasses—but is more powerful than—our existing `Pattern` system), but I'm not doing so in a way that's truly productive.
I would like to cover some of the individual strategies I've found that have helped me speed up my refactoring proces. 
After all, if the process of refactoring is the process of paying back tech debt, refactoring is incredibly important to maintaining velocity.

I am doing this for two reasons.
First, because I believe this is valuable information for any developer.
Second, because I want to solidify these ideas in my mind to further improve my refactoring down the line.

## Use Your Tools, but Not Too Much

In whatever language you're working with, there are likely specialized tools for refactoring.
For Java, I've used [IntellJ IDEA](https://www.jetbrains.com/idea/).
For Harper, I'm using [`rust-analyzer`](https://rust-analyzer.github.io/).
These provide neat functions for changing identifiers or moving modules, all while updating relevant references.

These tools are imperfect, however, and often fail to update references in parts of code that require a higher level of semantic understanding.

It's a common pattern for authors to create an instance of a class and assign it to a variable with the same name.

```rust
#[derive(Default)]
struct Foo {
    // Implementation details
}

fn main() {
    // The author of this code named the variable after the class
    let foo = Foo::default();
}
```

In these cases, when someone changes the name of the class, the associated variable name will not get updated.

```rust
#[derive(Default)]
struct Bar {
    // Implementation details
}

fn main() {
    // Variable name is not updated by our static analysis tool.
    let foo = Bar::default();
}
```

When doing a refactor like this, you need to read __every changed file__ to ensure the code still makes as much sense to a human as it does to the compiler.

## Plan It Out, but Not Too Much

I can't believe I need to say this, but it's chronically under-discussed.
If you're doing a fundamental change to how a system works, it is vital that you read the code first and plan it out.
The plan doesn't need to be specific nor need to be complete.

Having a good idea of what the start and end state should look like will save you hours of time.
While I am a proponent of [discovery coding](https://jimmyhmiller.com/discovery-coding) for new features and code, I find that it is lackluster when it comes to major _re_-writing of code.

To instruct people to plan out their changes may feel juvinile or basic, but I think it's worth mentioning.

## The Joy

Refactoring helps me write new features, faster.
Refactoring helps me find bugs in existing code.
Refactoring makes it easier for newcomers to join and contribute to a project.

It is one of my favorite pastimes.
I enjoy refactoring, but also want to do it well.
I hope you feel the same.
