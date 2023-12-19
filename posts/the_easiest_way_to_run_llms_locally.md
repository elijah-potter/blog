# The Easiest Way to Run LLMs Locally

![A Goofy Lookin' Llama](/images/llama.webp)

## LLMs

Unless you've been living under a rock for the past year, you already know what LLMs are.
If you _do_ happen to be one of the lucky few unaware of the current hype around these things, I'll go through it real quick.

A large language model (or LLM) is a statistical model capable of "predicting" a subsequent word or letter, given a body of text.
Essentially, it is a computer program capable of filling in the blank.
If you let it predict the next word, then feed the result back in, you can get some pretty human-looking text.


## Let's Be Clear

I hold a lot of skepticism on the practical applications of LLMs as a tool.
As a blanket rule, I never use LLMs or any similar technology in my education.

I know some people ask LLMs question like "explain the fundamental theorem of calculus to me like I'm five."
While they may get good results for questions, I do not want to lean on them as a crutch.
College is not only an opportunity to learn the raw material, but also an opportunity to learn how to learn.
If we know anything about LLMs, it's that its ability to answer complex questions break down as you move to more specialized classes.

Which is all to say: I did not investigate this with the intention of using it as a tool, I just wanted to play around.

## My Circumstance 

I use [arch, btw.](https://archlinux.org/)
While I enjoy the level of control it provides, I don't think it's for everybody.
This is partly because some things are quite difficult to set up.

For example, GPU support is limited and finicky, especially if you run an Intel Arc card, like I do.
While it works perfectly for some apps, like [blender](https://www.blender.org/), it doesn't work so well for other things.
My card only has 3 GB of VRAM, so it wouldn't be able to fit most models anyway.

So when I took on the task of running an LLM on my local machine, I started at looking at CPU-only solutions.

Initially, I tried to raw-dog [llama.cpp](https://github.com/ggerganov/llama.cpp).
That _worked_ but only so.
The command-line interface left a lot to be desired, and the process of downloading and loading various models was tedious and confusing.

## Ollama

That's when I discovered [Ollama](https://ollama.ai/).
Installing it was as easy as running:

```bash
sudo pacman -S ollama
```

To avoid wasting resources on multiple instances of each model, Ollama uses a server architecture.
You can start the server by running

```bash
ollama serve
```

Then, you can download an start chatting with a model with:

```bash
ollama run llama2
# Or:
ollama run mistral
```

## That's It

That's it!
It really is that simple.

Again, you might have no reason to do any of this.
Especially if you are happy with the privacy nightmare that is OpenAI, Google or Anthropic, or if you already have a system that works for you.
