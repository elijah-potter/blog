---
"description": "I like HackerNews, but I don't love that so much of it has turned into discussion of a single topic: AI. This is a version of HackerNews, filtered to remove any article focusing on __AI__. Refreshes about every ten minutes."
"pubDate": "Tue, 02 Jun 2026 23:54:52 GMT"
"keywords":
  - "Hacker News"
"image": null
"featured": false
"draft": false
---

# Hacker News, sans AI

I like Hacker News, but I do not love that so much of it has turned into discussion of a single topic: AI. So, I've created my own version.

[HNSansAI](/hnsansai) pulls from the official Hacker News API, looks through the content of each article, and discards any that mention a term related to "AI". That includes stuff like:

- "OpenAI"
- "Anthropic"
- "Copilot"
- "LLM"
- …and many more.

For visibility, I have embedded a version of it below, but you can also visit it (or bookmark it directly) [here](/hnsansai).

<div style="position: relative; width: 100%; height: 600px;">
  <a
    href="/hnsansai"
    style="
      position: absolute;
      top: -8px;
      right: 8px;
      z-index: 10;
      padding: 4px 8px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      text-decoration: none;
      color: black;
      font-size: 12px;
    "
  >
    Open ↗
  </a>

  <iframe
    src="/hnsansai"
    style="width: 100%; height: 100%; border: 0;"
    title="HNSansai"
  ></iframe>
</div>
