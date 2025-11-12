# Improving Rust Compile Times By 71%

If you maintain or work on a project in any compiled language, particularly a language that is known for having a slow compiler, I believe it is critical to regularly schedule time to do an analysis of your build process and make adjustments if necessary. 

Compile-time increases slowly as a project morphs and grows.
Slow enough that it often goes unnoticed.
I call this "compiler creep" and believe it to be similar in many ways to [lifestyle creep](https://en.wikipedia.org/wiki/Lifestyle_creep).
By scheduling time to do a full accounting of where your CPU cycles are going, you can preemptively save yourself (and your contributors) a lot of time.

Yesterday was the big day for me. Over the last few months, [Harper's](https://github.com/automattic/harper) compile time from scratch in GitHub actions had ballooned to a five full minutes. On my personal laptop, it had grown to three minutes. That may not sound like a lot, but I often need to build from scratch when swapping between branches or checking out a pull request. Incremental build times had also grown to an unjustifiable duration. Iterating upon unit tests was starting to become quite slow.

Harper's low latency is one of the reasons many turn to it over the alternatives. In the early days, we accomplished that by cranking the LLVM optimizer to the max, reducing the number of codegen units to one and using link-time optimization to take care of the rest. At the time, I believe this resulted in a ~30% performance uplift. Not bad!

For the uninitiated, a codegen unit is the smallest unit of work that is passed to the LLVM compiler. If you allow the project to be split into more than one codegen unit, you can allow more than one compiler to run at a time. This, therefore, increases the number of physical cores that can be used at any given moment during compilation. The downside is that the compiler misses out on optimization opportunities at the boundaries between codegen units. 

So when I sat down yesterday, I was hardly surprised to see that code generation was the bottleneck. The compiler was spending very little time type-checking and linking, and a lot of time generating and optimizing machine code.

My initial thought was to reduce the _amount_ of code that needed optimizing. 
So I did what anyone else would do and went searching for unnecessary dependencies and other kinds of dead code in the repository. I found some, but not enough to make a meaningful dent in the compile time.

That's when I took a look at our build configuration and asked myself: "Do we still need LTO? Could we increase our codegen units?"
 
In the last few months, I've made some significant improvements to caching and pipelining, which means the bottleneck has shifted from compile-time optimization to memory bandwidth. We simply don't need the compiler to do as much work anymore. So, I tried disabling LTO and reverting the codegen units to their default value. What happened?

Clean builds went from five minutes on CI to less than two. All in, that's an improvement of 71%. On top of that, since it was the code generation stage that was slowing down incremental builds as well, we saw a similar improvement to test execution time. That means there is now less time between making a change in the code, and knowing how it affects our existing test cases. Since that's a huge portion of a contributor's time, improvements to incremental builds can be force-multipliers for the entire project.

I was surprised such a simple change would have such an outsized impact on the developer experience. It felt too good to be true, so I re-ran our benchmarks to see if the change would have a negative impact on Harper's actual performance. Our uncached lint times took three percent longer than before. I think that's acceptable.

Is there a lesson to be learned here? I think so. I implore you to take a half-hour this week to mess around with your compiler's settings. Even an improvement of a few seconds per iteration can compound into hours of time savings, both for you and your fellow contributors. If you think your compiler settings are already perfect, do it anyway. Your code or requirements may have changed.

This is great step in my recent work to make people's first contributions to Harper as frictionless as possible. 
