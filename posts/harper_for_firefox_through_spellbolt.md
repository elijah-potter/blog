# Harper in Firefox Through SpellBolt

![Ford Street, Golden, Colorado](/images/ford_street.webp)

We designed Harper to be the ultimately portable grammar checker, but we're still working on living up to that promise.
As the Harper Chrome extension becomes more capable day-by-day, it has one critical weakness: it doesn't support Firefox.
Since Chrome has a much larger market share, it isn't a priority at the moment (although we accept contributions).

This is a wonderful example of where the open-source nature of the Harper's core engine really shines.
Someone has taken [`harper.js`](https://www.npmjs.com/package/harper.js) and put it into their own extension.
[SpellBolt](https://addons.mozilla.org/en-US/firefox/addon/spellbolt/) is a Firefox extension that delivers Harper's fantastic grammar checking straight into your Firefox browser.
My initial testing shows that it's a solid extension.

I am delighted to see people making use of the pluggable architecture Harper has adopted, and I can't wait to see what SpellBolt does next.
