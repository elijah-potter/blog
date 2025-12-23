# Harper Is in Cursor and Visual Studio Code

Harper is a grammar checker for developers. Its roots are in code editors like Neovim, Helix, Zed, and you guessed it—Visual Studio Code. I don't think a lot of my followers know this, so I thought I'd give it a little shout-out here.

Since Cursor and Windsurf are forks of Visual Studio Code, Harper is available for both [via the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=elijah-potter.harper). Give us a good rating over there if you install the plugin and end up liking it!

![A screenshot of the Harper Visual Studio Code extension checking its own source code](/images/harper_vscode_screenshot.png)

## How Does It Work?

Harper works similarly to a number of other extensions you may have installed. Like Pylance or ESLint, it runs in the background as [a language server](https://microsoft.github.io/language-server-protocol/). Each time a modification is made to your document, it reads your comments for grammatical mistakes and typos and displays them as errors or warnings (it's configurable).

## Does It Support My Programming Language?

The Harper language server, thanks to contributions from the community, supports a pretty [wide range of programming and markup languages](https://writewithharper.com/docs/integrations/language-server#Supported-Languages). We've only recently added support for PHP, so if that's your thing, know you're in somewhat uncharted territory. If you find issues, [let us know](https://github.com/Automattic/harper/issues).
