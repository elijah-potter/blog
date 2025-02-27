# Prompting Large Language Models In Bash Scripts 

I've been experimenting with using LLMs locally for generating datasets to test [Harper](https://writewithharper.com) against.
I might write a blog post about the technique (which I am grandiosely calling LLM-assisted fuzzing), but I'm going to make you wait.

I've written a little tool called [`ofc` that lets you insert Ollama into you bash scripts](https://github.com/elijah-potter/ofc).
I think it's pretty neat, since it (very easily) lets you do some pretty cool things.

For example, you can swap out the system prompt super easily, so if you want to compare behavior across prompts, you can just toss it in a loop:

```bash
#!/bin/bash

subreddits=("r/vscode" "r/neovim" "r/wallstreetbets")

# Loop over each item in the list
for subreddit in "${subreddits[@]}"; do
  echo "++++++++ BEGIN $subreddit ++++++++"
  ofc --system-prompt "Assume the persona of a commenter of $subreddit" "What is your opinion on pepperjack cheese."
  cat
done
```

Or, you can instruct a model to prompt itself:

```bash
ofc --system-prompt "$(ofc "Write a prompt for a large language model that makes it think harder. ")" "What is a while loop?"
```

# Installation

`ofc` is installable from either crates.io or this repository.

```bash
cargo install ofc --locked

# Or...
cargo install --git https://github.com/elijah-potter/ofc --locked
```
