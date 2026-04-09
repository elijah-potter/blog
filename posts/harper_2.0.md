# Harper 2.0

Hey all! We're finally releasing Harper 2.0. Why? 

It isn't because we have any new groundbreaking features in this release, because we don't let major versioning stop us from pushing those out as soon as they're ready. It's because we have some breaking changes.

The biggest one only applies to you if you consume `harper.js`. From now on, instead of importing your binary from the main Harper module, you'll import it from one of four specialized modules.

Previously, you'd import the Harper WebAssembly binary with:

```javascript
import { LocalLinter, binary } from "harper.js";
``` 

As of Harper 2.0, you'll import it like this:

```javascript
import { LocalLinter } from "harper.js";
import { binary } from "harper.js/binary"; 
```

It's that simple! Thanks to this change, you'll find that your applications are more conducive to tree-shaking and therefore might even be a bit smaller!

In addition to that large breaking change, we also have a bunch of smaller improvements rolling out. I won't go through them one by one, but you're free to read through any of the linked pull requests in the [main release notes](https://github.com/automattic/harper/releases/tag/v2.0.0).  
