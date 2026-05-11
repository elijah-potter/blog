---
"description": "This week of Radical Speed Month has been dedicated to putting the disparate components of the Harper Desktop App together."
"pubDate": "Fri, 08 May 2026 16:08:14 GMT"
"keywords":
  - "Harper"
  - "Desktop"
  - "Automattic"
  - "Radical Speed Month"
"image": null
"featured": false
"draft": false
---

# A Quick Update on Harper Desktop

This week of Radical Speed Month has been dedicated to putting the disparate components of the Harper Desktop App together.
In other words, we have been in what [Shane Wighton](https://www.youtube.com/@stuffmadehere) would call "integration hell".

Due to the constraints put in place by the operating system and our decision to use Tauri, Harper Desktop needed to be split into three main pieces: the highlighter process, the main Rust Tauri process, and the Svelte frontend.
We use the main Rust Tauri process as the source-of-truth for all user configuration and state, which meant we needed to orchestrate a nontrivial amount of communication between it and the other two components.

At the same time, I've been integrating everything (including [Jason's wonderful revamp of the Harper editor](https://github.com/Automattic/harper/pull/3278)) into the main Harper repository.
It's been a slow going process, and there is still some work to be done with CI. 
At the same time, it's quite satisfying to see everything click into place.

Next, we plan to focus our attention on the more fit-and-finish pieces of the project.
That means wrapping up the implementation of certain parts of the configuration, building out updating logic, and creating an actual download page on our website.
