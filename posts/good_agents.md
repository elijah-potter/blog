---
"description": "The spirit of Radical Speed Month includes an impetus to experiment. So experiment I have."
"pubDate": "Fri, 15 May 2026 19:20:39 GMT"
"keywords":
  - "Pi"
  - "OpenCode"
  - "Claude Code"
  - "Codex"
  - "AI"
"image": null
"featured": false
"draft": false
---

# Good Agents for Developers

The spirit of Radical Speed Month includes an impetus to experiment.
So experiment I have.

In particular, I have been trying two new coding agents: [OpenCode](https://opencode.ai/) and [Pi](https://pi.dev/).
Both were interesting and taught me something new, but I only intend to continue using one of them.

## OpenCode

OpenCode caught my eye for the very quality it's named after: OpenCode is open source.

At first, it seemed to me to be an open source knockoff of OpenAI's Codex.
After a few minutes of use, though, I discovered how it brings "plan mode" front and center.
Claude Code and Codex both include plan mode, but in both cases it feels like an afterthought.
I had tried it a few times, but I was left unimpressed.
Not so with OpenCode.
It's a deeply integrated part of the experience. 
If you are using OpenCode without plan mode, you're holding it wrong.

Overall, I found it a far more productive and enjoyable experience than Codex.

## Pi

Pi is amazing.
Similar to OpenCode, Pi is an open source agent.
Unlike OpenCode, it isn't designed to be a clone of Claude Code or Codex.
It is its own thing with an entirely separate philosophy.

### It Is Static

Pi was born out of a frustration with Claude Code: It did too much, and it changed too often.
This is a problem for developer tooling.
Developers expect the systems underlying their tooling to be static, so the tools themselves only need to change when the requirements do.
This simple idea is why we have standards like [Semantic Versioning](https://semver.org/).

The skills, prompts, and tools we write _for_ our agents depend on the underlying behavior of these agent loops to remain static.
When Anthropic or OpenAI adjust the system prompt or change how the model's tools are called, the things we build around them break.

Pi is not like that.
Pi is intended to be as simple as possible, and as extensible as possible.
An engineer to automate tasks using Pi and expect those automations to continue working forever.

This is important to me, and if you're an engineer, it should be important to you.

### It Is Extensible

The energy behind Pi feels a lot like the energy behind Neovim.
It's built for and by a community of hackers, who each have their own custom setup.

I've only been using it for a few days, but I already feel an indescribable sense of ownership over my prompts, skills, and the extensions I have installed. 
When I feel a deficiency in my workflow, I don't feel that I need to wait until Anthropic or OpenAI has time to address it.
I can address it myself.

## Think Critically

If you aren't actively pushing your brain to it's limit while programming — whether you are using an agent or not — you aren't doing your best work.
Trying both of these agents has taught me that it is entirely possible to push my brain hard while also using an agent to take away some of the tedium.
In the end, I get better software faster.
