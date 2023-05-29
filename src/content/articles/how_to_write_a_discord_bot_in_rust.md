---
title: "How to Write a Discord Bot in Rust"
description: "A look at how a 'low-level language' can be used effectively for some pretty high level stuff."
pubDate: "May 02 2021"
heroImage: "/images/flat_ferris.png"
---

Discord is an instant message platform with more than 150 million monthly active users. The main appeal seems to a combination of the wide reach that platforms like StackOverflow have, as well as the instant delivery of the instant messaging concept. One of the best features of Discord is it’s seemingly unlimited hackability of the platform via it’s “Bot” system. The Bot system allows developers to add functionality to Discord communities by writing software that interfaces in a similar way that people do. I want to give you an introduction on how to do that in Rust.

## Interaction

Most interaction with Discord bots happens via commands, not dissimilar to terminal applications. Commands may look like `!play Eat it by Weird Al`.

![Ping! Pong!](/images/ping_pong.png)

The bot we are going to make now will simply respond to `!ping` with "Pong!".

## Template

This tutorial is going to teach you how to set up a bot from scratch, but the easiest way to get started is by using my [cargo generator template](https://github.com/chilipepperhott/discord-bot-template)

## Set up the Project

Using a functioning Rust environment, use cargo to create a new project. E.g:

```bash
cargo new tutorial-bot
```

Next, we have to add [Serenity](https://github.com/serenity-rs/serenity), the library for creating Discord bots in Rust. We also have to drop in Tokio, because Serenity takes advantage of it's async runtime.

You can do this either via cargo-edit:

```bash
cargo add serenity
cargo add tokio --features full
```

or by just adding them to Cargo.toml:

```toml
[dependencies]
serenity = "0.10.5"
tokio = { version = "1.5.0", features = ["full"] }
```

## Setting up the Standard Framework

Serenity has a lot of flexibility. You have access to a event handler that allows fine grain control of events. You also have access to a standard framework that makes it ridiculously easy to respond to commands.
Before we do anything else, we have to make our main function async. It is super easy to do that, just replace it with:

```rust
#[tokio::main]
async fn main() {
}
```

First, we want to get our bot token in. In an actual bot, please obtain it via an environment variable or some other method. We are only doing it this way for simplicity.

```rust
let token = "{your bot token}";
```

If you do not know how to get a bot token, please follow [this tutorial](https://www.getdroidtips.com/discord-bot-token/).

The Serenity Standard Framework splits your bot's commands into groups. Each group can have multiple commands. For example, a bot might have two groups: one focused on fun and one focused on math. The former has commands like !meme, while the latter may have various math functions, like sin!. This is also how we will add commands to our bot.

First, add the needed structs and macros to the file:

```rust
use serenity::{Client, client::Context, framework::{StandardFramework, standard::{CommandResult, macros::{group, command}}}, model::channel::Message};
```

Next, create a struct that we will attach our commands to:

```rust
#[group]
#[commands()]
struct HelloWorld;
```

Once we have added our commands, we will enter them into the commands sub-macro.

Create an instance of `StandardFramework` and add our group to it. We can also configure our command prefix now.

```rust
let framework = StandardFramework::new()
    .configure(|c|{
        c.prefix("!")
    })
    .group(&HELLOWORLD_GROUP);
```

Notice that we used a reference to a static struct called HELLOWORLD_GROUP instead of just adding our group. This is the output of the #[group] macro.

Now that we have created our framework, we have to attach it to a Discord client.

```rust
let mut client = Client::builder(token).framework(framework).await.expect("Could not start Discord");
```

Start it.

```rust
client.start().await.expect("The bot stopped");
```

## Adding the Command

Now that we have the framework set up, let's add a command.

```rust
#[command]
async fn ping(ctx: &Context, msg: &Message) -> CommandResult{
}
```

This command only needs the Discord client's Context, the message that contains the command, and returns a `CommandResult`.
 Do not forget to add the command to the group:

```rust
#[group]
#[commands(ping)]
struct HelloWorld;
```

If you don't, it will simply not get run.

We want the bot to reply to the !ping command with "Pong!", so let's add that to the inside of the ping function:

```rust
msg.reply(ctx, "Pong!").await?;
Ok(())
```

## Full Code

Here is the full code for the bot:

```rust
use serenity::{Client, client::Context, framework::{StandardFramework, standard::{CommandResult, macros::{group, command}}}, model::channel::Message};
#[tokio::main]
async fn main() {
    let token = "Your bot token";
    let framework = StandardFramework::new()
    .configure(|c|{
        c.prefix("!")
    })
    .group(&HELLOWORLD_GROUP);
    let mut client = Client::builder(token).framework(framework).await.expect("Could not start Discord");
    client.start().await.expect("The bot stopped");
}
#[group]
#[commands(ping)]
struct HelloWorld;
#[command]
async fn ping(ctx: &Context, msg: &Message) -> CommandResult{
    msg.reply(ctx, "Pong!").await?;
    Ok(())
}
```

## That's it

If you build and run your app, you should have a functioning Discord bot!
Serenity is an amazing crate and is an absolute joy to work with. I hope you learned something. There is a ton more stuff that I did not cover here. Feel free to look at the [Serenity docs](https://docs.rs/serenity/latest/serenity/) and examples to learn more!
