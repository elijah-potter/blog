# Improving Harper for Old Laptops

The most common complaint I’ve been hearing as of late relates to Harper’s performance. I’ve been told that Harper has gotten slow.  

I was puzzled. Nothing had substantially changed in our core engine that could have made it slower. Our benchmarks hadn’t shown any slow-downs. What could be prompting users to complain about performance?  

The problem was clearly in the Chrome extension. Those who complained were doing so with screenshots from Notion or Ghost. Could recent developments in the [WebAssembly ecosystem](https://webassembly.org/news/2025-09-17-wasm-3.0/) be the cause? Nope. Could it have something to do with the kinds of applications users were trying to use with Harper? Nope. The complaints seemed untethered to a specific domain or program. What could be slowing our users’ down?  

## The Problem

As it turns out, the problem wasn’t the actual grammar checking, it was rendering the highlights on the page.  

The Chrome extension’s hot path looks something like this:  

1. Extract the text from the page  
2. Run `harper-core` (the grammar engine) over it to find mistakes  
3. Use DOM APIs to compute the bounding boxes of those mistakes on the page. This is important: This computation requires the browser to reflow the layout of the page.  
4. Render additional DOM elements to the screen over these bounding boxes. This also requires the browser to reflow the layout of the page.  

Requiring the browser to lay out the page more than once per frame is called *“layout thrash”*, and it’s considered bad practice for performance reasons. It causes more CPU usage than otherwise, which can slow down complex websites and reduce battery life. It isn’t noticeable for newer computers (4 years old), but it **can** be quite jarring for older laptops.  

## The Solution

Fortunately, there’s a solution. Just recently, W3C standardized [The Custom Highlight API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API), which allows us to render highlights without interacting with the DOM at all. This saves us two full layout refreshes and allows the browser to offload more work to the GPU, saving CPU cycles and battery life.  

It’s not all roses and rainbows. For one, we can only use this optimization for text editors that use `contenteditable` elements. It doesn’t help for `<textarea />` or `<input />` elements. Firefox also doesn’t support this part of the API, which means we have to fall back to the old highlighted renderer on Gecko-based browsers.  

There are also some minor differences between how the new renderer and the old renderer style their highlights. This is because highlights using the Custom Highlight API can’t be styled using any old CSS, but rather a subset.  
