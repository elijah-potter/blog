# Notifications

I have found that the first couple hours of the day are my most productive.
I try to move tedious tasks to later so I can focus on solving "hard problems" that need my full attention.

In the past, this has been hard to do for one reason: GitHub notifications.
They pull me in and consume hours of my time.
Responding to and working with OSS contributors is important to me, but that can happen later in the day.

So I wrote a little ViolentMonkey script to hide the notifications icon during these early morning hours.

```javascript
// ==UserScript==
// @name        Hide Notification Indicator
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     1.0
// @author      Elijah Potter
// @description 1/29/2025, 8:16:11 AM
// ==/UserScript==

function hideEm() {
  const matches = document.getElementsByClassName(
    "AppHeader-button--hasIndicator",
  );
  for (const element of matches) {
    element.remove();
  }
}

new MutationObserver(hideEm).observe(document, {
  childList: true,
  subtree: true,
});
```
