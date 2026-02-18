# LaTeX Support Is Coming to Harper

It's been a long time coming, which is why I'm thrilled to say that Harper will soon support LaTeX. This is something our users have been pleading for since the beginning of the project. LaTeX support feels like a feature that is comparatively low‑effort, but unlocks a massive new consumer segment with little existing competition. It has the potential to be a huge boon to our user base and our offering overall.

For context, [LaTeX](https://en.wikipedia.org/wiki/LaTeX) is a document markup language (similar in soul to Markdown), primarily used by STEM professions and students. It's extraordinarily good at formatting and rendering complex mathematical equations and chemical formulas.

## The Market

Neither Grammarly nor LanguageTool support LaTeX documents, yet sites like Overleaf (the most popular LaTeX editor) regularly [see an excess of 400,000 daily active users](https://www.overleaf.com/blog/nine-years-nine-million-users). That's an enormous market of people who tend to be technical and who care about their privacy. Since the two most popular grammar checkers (Grammarly and LanguageTool) don't support sites like Overleaf in any way, we don't have much competition to worry about.

The story is similar (albeit to a lesser scale) for Typst, another document markup language. We haven't even merged support for Typst yet, and we're already seeing people pick up Harper explicitly for use in the Typst online editor.

## Previous Attempts

On two separate occasions, members of the Harper community have opened (and subsequently closed) pull requests which tried to add LaTeX support to Harper. I've put links to that work below for posterity.

- [PR by Grant Lemons](https://github.com/Automattic/harper/pull/100)
- [PR by Shreyas Minocha](https://github.com/Automattic/harper/pull/2073)

The fundamental problem with LaTeX is that its underlying language, TeX, is not regular. In order to parse the language, you need to actually run it. This is why LaTeX documents can take as many as several full minutes to compile and render to a PDF.

Rather than “correctly” read and run the TeX code contained within LaTeX documents, these previous attempts (including mine, which we will discuss in a second) choose to assume that LaTeX commands are keywords in a more abstract language. Some edge‑cases will naturally arise when we ignore the lowest level of abstraction, but doing so allows us to parse most real documents with less effort.

## Implementation Details

It was very important to me that our LaTeX support was fast, small, and **could be compiled to run in the browser**. That last bit is critical, because previous attempts (by the community) to add LaTeX support tried to use Tree‑sitter, which cannot be easily compiled to run in the browser. Almost all LaTeX users (which is the vast majority of STEM undergraduate and graduate students) use Overleaf, an online LaTeX compiler and editor. Developing LaTeX support without making it possible to use Overleaf would be like developing a text editor that can't be used with a keyboard. Simply illogical.

To make this happen, I wrote my parser from scratch in Rust. Actually, calling it a parser would be an insult to all of parser‑kind. My solution produces a character mask. That is, it identifies which parts of the document are real English text, and which parts are LaTeX code. From there, I can just mark all the LaTeX sections as “unlintable” and thus undeserving of Harper's discerning gaze.

The curious can [check out my PR](https://github.com/Automattic/harper/pull/2689).

## What's Next

While we're simultaneously working on rolling out our new Weirpack system and our small language model, I plan to work with some of our undergraduate STEM student users. I find it quite likely there's a use‑case for our LaTeX and Typst support that I'm not considering. It's a huge market, and I'm excited to work with those in it.

## A Quick Correction

A few days after writing this post, I found evidence that LangaugeTool supports an older version of the Overleaf editor.
While it doesn't seem to support the latest version, this new information makes my previous statement that it "doesn't support sites like Overleaf in any way" false.
I apologize for the misinformation.
