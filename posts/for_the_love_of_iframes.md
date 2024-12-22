# For The Love of `iframe`s.

I adore a good `iframe`.
They're so elegant as a web component.

Just expose an endpoint, say [`https://writewithharper.com/editor`](https://writewithharper.com/editor?initialText=This%20is%20an%20interactive%20buffer%20you%20can%20use%20to%20to%20check%20your%20work), set it up to accept some query parameters and get it hosted.
Now you can access this web-component from any page that has a loose enough Content Security Policy.
For me, that means my [school assignments](https://elijahpotter.dev/articles/the_simplest_neovim_markdown_setup) and other assorted documentation.

It also means that I can avoid setting up a complex build system for MDX, while still being able to include interactive components.

The example from earlier:

```html
<iframe
  src="https://writewithharper.com/editor?initialText=See, we can now embed the the Harper editor%0Arght into this document!%0A%0AIt's a little too easy."
  width="100%"
  height="400px"
  style="border-radius:10px;border:0px"
></iframe>
```

One major caveat though: when we pass our arguments to the component through the query URL, this gets sent to the component's server as well.
**I** certainly trust the Harper website's server, since I maintain it and the code is [open source](https://github.com/elijah-potter/harper/tree/master/packages/web), but that isn't always the case.

<iframe src="https://writewithharper.com/editor?initialText=See, we can now embed the the Harper editor%0Arght into this document!%0A%0AIt's a little too easy." width="100%" height="400px" style="border-radius:10px;border:0px" ></iframe>

You should also probably avoid doing this _too_ much.
Most browsers spawn a whole new process for every `iframe`, so if you want things to stay snappy it is best to limit yourself to just one (**maybe** two) per page.
