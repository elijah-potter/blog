# Footguns of the Rust WebAssembly Target

![A trail in Golden, Colorado](/images/rail.webp)

WebAssembly—even after several years of standardization—is still a nascent technology.

I've been working with Rust and WebAssembly for nearly four years now.
This post is intended to be a distillate of that experience, formatted for developers who are interested in publishing WebAssembly code to npm.
Specifically, these are the footguns I've personally encountered while working on [`harper.js`](https://writewithharper.com/docs/harperjs/introduction), a WebAssembly-powered package for grammar checking at the edge.
This page should be valuable if you are even speculating on the possibility of using WebAssembly in your codebase.

---

## 1. Exposing Only Synchronous Functions

The Harper package exposes one interface that captures all of its WebAssembly interactions: the **Linter**. This is an object that handles downloading and compiling the Harper WebAssembly module, as well as invoking functions in it. Every function returns a `Promise`. There are several good reasons for that:

- WebAssembly modules larger than 4 kilobytes must be instantiated **asynchronously** to avoid blocking the event loop during download or compilation. This is a technical limitation that cannot be avoided with clever logic.
- If most functions are asynchronous, you can centralize computation and caching into a single instance of the WebAssembly module, hiding the complexity of instantiation and making caches easier to build.
- If your problem domain can be computationally intense, it might be prudent to offload jobs onto a **web worker**, which is easier if every function of your facade is asynchronous.
- It will be easier for both you and your users to expose any important function as asynchronous out of the gate.


## 2. Assume Rust Can Trivially Do IO

Whatever you do: avoid assuming that Rust libraries (like `reqwest` or `rand`) will be able to perform IO without some work on your end. WebAssembly alone is **not capable of IO**, which means any function in that category will require some amount of JavaScript to work properly.

Rather than leaving that up to the Rust toolchain to figure out, save yourself the headache and **inject the necessary JavaScript functions** directly into the WebAssembly module by passing them through `wasm_bindgen`.

---

## 3. Just Inline the WebAssembly Module

**Obsidian plugins**, for example, must be composed of exactly one JavaScript file, which means everything must be inlined. In the interest of keeping the bundle size small, it's much easier for the package developer (of `harper.js`) to set up inlining than the plugin developer.

On the other side of the spectrum, **Chrome's Manifest V3** disallows WebAssembly from being loaded inline.

If you plan for your package to be consumed by a variety of applications, know that it will also be consumed by a variety of **bundlers**. Both bundlers and applications are pretty inconsistent with their inlining and tree-shaking behavior. To avoid problems, you should provide **two versions** of your package:

- One where your WebAssembly module is already inlined.
- One where it isn't.

# Wrapping it Up

Harper’s problem domain is not your problem domain.
We have to integrate with a variety of unique applications, which means we must keep our system flexible.
That may not be the case for you, which may mean these footguns do not apply.
If you have any questions about any other problems the Harper project might have faced, let me know.
