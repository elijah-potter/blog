# LLM-Assisted Fuzzing: A New Approach to False-Positives

> __Preface__: this post was actually written on February 24th, despite being published today.

I'd like to do some reflection on how we can improve [Harper's](https://github.com/automattic/Harper) output. It is fundamentally a process problem. For context, let us go through a contrived example.

![[Sumner Evans](https://sumnerevans.com/) reported a bug to me while writing a tech talk about CI and CD](/images/sumner_screenshot_error.png)

1. Somebody (usually me) discovers an error in their writing that Harper did not catch. This is a concrete string like "I have a a care in the world".
2. I look for other forms of the error to see if I can generalize it to more cases. Here, we see an indefinite article repeating itself. We could just look for the exact string "a a" and call it day, but we can cover more cases by looking for <indefinite article> <indefinite article>. In fact, we can generalize it even further. In this case, writers want to avoid repetitions of any word that is not a homograph.
3. Once the code is written that defines the rule, I push it out, and wait to hear from users if any false-positives arise.

This is a flawed system, particularly that last step. I've found something a bit better.

I've been experimenting more with LLM tooling, particularly Ollama. With it, I've set up a useful system for identifying false-positives before pushing changes out to users. I like to call it "LLM Assisted Fuzzing".

## LLM-Assisted Fuzzing

Fuzzing is a common practice wherein engineers rapidly and continuously push random data through their system to deterministically check if it is behaving correctly (i.e. not crashing). If a particular batch of random data causes an issue, it is elevated to an engineer.

Harper as a program stands in a somewhat unique position: it analyzes natural language to identify grammatical errors. LLMs exist as a direct complement to it: they generate "natural" language. Do you see where I am going with this?

Let's be clear: language models do not generate grammatically correct text even a good amount of the time. As a result, their output is useful as a proxy for our user's written work. If we can implement a feature that reliably corrects (without false-positives) an LLM's output, we can reasonably expect it to work for our user's text.

## My Initial Attempt at LLM-Assisted Fuzzing 

I started working on this Friday morning, and finally have what I would call a "first draft" of an LLM-assisted fuzzing system for identifying false-positives. Here's how it works:

I start a local Ollama server, preloaded with several models (which I'll expand on more below).

I run a bash script that repeatedly feeds the same prompt into the models [using a command-line client for Ollama](https://elijahpotter.dev/articles/prompting_large_language_models_in_bash_scripts). This gives me a large dataset of responses to the prompt. I'm not looking for the semantic content of the response. I'm interested in extensive coverage of whichever linguistic domain I've defined in the prompt. I can run this as long as I like before going on to the next step.

Once I have a large dataset, I run a separate script that runs Harper over each response. If it finds an error, the script opens the response in [the Harper editor](https://writewithharper.com/docs/about) for further inspection.

The biggest issue with this workflow right now: regardless of my prompts, the LLMs continue to emit actual grammatical errors. This means that when I go through this process, I get at least as many true-positives as false-positives. It also does nothing for false-negatives.

## Tweaks

There are a couple parameters here that I'm going to continue to tweak as the workflow becomes more mature. So far, I've been using `deepseek-r1:32b` and `mistral-small`. DeepSeek tends to use more colorful language than Mistral, which runs much faster on my machine.

I've also been iterating on the prompt as I go. Here's the latest version:

```plaintext
Please write a long, drawn-out essay on a topic of your choosing.
Write out the essay multiple times before giving me your final draft.
Your final draft should be grammatically perfect, clearly demonstrating that you put time and effort into your submission.

I repeat: I do not want to see anything other than your final drafts.
Do not give me any intermediate work.

Furthermore, do not use any characters or words other than English. 
I do not want Chinese or anything else.

I have all the time in the world. I'm perfectly fine with waiting a little longer if it means you give me something you are proud of.
```

When I move on to tackling false-negatives with this, I'll be able to prompt the model to give me specific kinds of errors, which makes it significantly more useful than trying to track down existing work.
