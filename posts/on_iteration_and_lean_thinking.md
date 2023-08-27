# On Iteration and Lean Thinking

![A linup of Model T Fords](/images/model_t.jpg)

The most valuable, unique aspect of software development is the speed at which we can iterate.
Software projects that don't iterate quickly and frequently usually stagnate and fail, while projects that work with user feedback on an almost real-time basis are the most successful.
I've noticed the difference personally, with my work at [Archytas Automation](https://archytasinc.com/).
Most recently, I've read _The Lean Startup_, _The Art of Motorcycle Maintenance_ and _The Pragmatic Programmer_.
While each uses their own terminology, both go into depth on the depth on the topic of fast iteration cycles.

## Lean Manufacturing and Lean Thinking

Lean manufacturing, as explained in _The Lean Startup_ is a production methodology focused on avoiding waste.
The book's primary example is the Toyota Production System.

In the mid 1930s, the world's largest car manufacturer was Ford.
Ford's factories produced thousands of unique parts, which together could form a car.
They produced these parts in bulk, and each distinct part had an entire machine dedicated to producing it.
There was a machine that made springs, a machine that made nuts, and a machine that made bolts.
No machine could make any part other than the one it was designed for.

This was great: it meant that cars would be cheaper than ever, and more people could experience car ownership.

Around this time, Toyota entered the automotive industry.
However, they did not have the time, nor the money to design and build the same kind of hyper-specific manufacturing machines that Ford used.
Instead, they chose to purchase comparatively few hyper-__generalized__ machines.
Their stragedy was to build one car at time, and sell it as soon as possible (ideally the moment it rolled off of the factory floor).
This way, if there is an issue with the vehicle, the design can be modified before too many faulty cars are assembled.

The Toyota Production System emphasized flexibility over efficiency.
By staying flexible, Toyota gave itself the ability to optimize all aspects of the business in the middle of a production run.

On one hand, the Ford process looked like this:

- Get materials for one hundred cars.
- Fabricate over a thousand distinct parts required for each car (likely more than a hundred thousand total parts).
- Assemble one hundred cars .
- Sell one hundred cars.
- Receive feedback on vehicle and production process.
- Perform all possible changes to the vehicle's design and production process (which would be very little).

With this many steps, each taking place over a comparatively long time, the iteration cycles are few and far between.
On the other hand, the Toyota Production System looked like this:

- Get materials for one car
- Fabricate the relatively few distinct parts required for the car
- If there is an issue with the production process (a machine breaks, someone gets hurt, etc.). 
  Stop the whole process and fix the issue, so it will not affect future cars.
- Assemble one car.
- Sell one car.
- Receive feedback on vehicle and production process.
- Perform all possible changes to the vehicle's design and production process (which could be quite a lot, given the flexibility of both).

Counterintuitively, performing each step with a batch size of one actually ended up being _more_ efficient.
Even though Ford experienced a higher level of efficient within each batch, their process led to many more wasted parts being manufactured,
as well as a lack of communication between steps, which dramatically increased the amount of wasted effort.
Additionally, because the Toyota Production System allowed comparatively rapid iteration, Toyota vehicles were simply better: more durable, and more useful to their customers.

### Lean Thinking In Software

In software development, it can be tempting to go the Ford route:
create a detailed plan of all the features you wish to add to your service,
then, develop the features, and deliver them all at once.
Only then do you accept feedback and evaluate the usefulness of each feature.

In _The Lean Startup_ however, Eric Ries suggests an alternative methodology, inspired by the Toyota Production System.
Before deciding on which features to include in your service in an all-at-once, shot-in-the-dark manner, perform experiments.
Create an absolutely minimal prototype of the feature, give to a customer, and observe how they use it.
It is possible they find the feature unhelpful, or they use it in a way you didn't expect.
By running the experiment early on, there are far fewer unhelpful features introduced, and the customer gets a product more closely tied to their needs.

Further, it is possible that your understanding of the problem domain is misinformed.
Planning out the entire product release months in advance is problematic when the requirements of the project change (and they will, __often__).

## Why Interpreted Languages Can Be So Productive

Interpreted programming languages are almost laughably pervasive. 
Of the top ten most popular programming languages on the 2023 StackOverflow Developer survey, six were interpreted.
That count does not include TypeScript, which can be used in a semi-interpreted manner.
Interpreted language popularity is often chalked up to their ease-of-use, abstraction, and simple, english-like syntax.
However, I believe there is an additional reason: they allow one to iterate much, much faster. 

## Micro-iterations

Iterations can happen on any timescale. 
__Micro-iterations__ occur happen over the shortest time scale.
These are small, incremental changes that occur (usually) when debugging or optimizing code.
It is the amount of time (and by extension, mental overhead) that results from a change.
The longer it takes for tests to compile and run, the longer it takes to debug.

I believe you can model it like so:

$$
\text{time to debug} = (\text{time to test})^2 * \text{text editing}
$$

> This is __not__ an exact, representative equation, merely an abstraction to illustrate my point, based on personal experience.

In other words, the total debugging time increases quadratically as the time it takes to _test_ a change to the program increases.
Notice how, as the `time to test` increases, the actual amount of time `text editing` falls to a negligable ratio of the total.
I believe this comes from the fact that as compilation time increases, the amount of information gleaned per micro-iteration tends to decrease.

### JIT Compilation and Hot Reload

The concepts of lean thinking extend into compiler technology.
The Toyota Production System includes the concept of "Just-in-time", meaning,
"to only produce exactly what is needed for the product, exactly when in the process it is required."
Avoid planning resource requirements ahead of time and build systems that only produce what is actually needed.

While the meaning of "Just-in-time" __is different__ when we refer to compilers, the line of thinking is ultimately the same.
Instead of wasting valuable, human-scale time on compilation and optimization of irrelevant code, just compile the code you need, when you need it.
This drastically reduces the amount of time to test, and ultimately, the time to debug.

Further, technologies like React and Flutter's Hot Reload make it possible to complete these micro-iterations without having to restart your program. 
I believe this is partly why interpreted languages are so beginner-friendly (other than the high level of abstraction they typically provide).
Newcomers to programming spend most of their time on syntactic issues and simple runtime errors.
By making micro-iterations happen as fast as possible, you make these issues less annoying to deal with.

## Conclusion

Iteration is incredibly important to any design and development cycle, especially in software.
Since I have embraced iteration, I've seen a dramatic improvement in my productivity and effectiveness.
So I encourage you: if your build process takes 30 minutes, spend some time on improving it.
If you are working on a project that hasn't been put in front of a customer, try showing it to a family member or non-technical friend.
Ask them for brutal honesty, and your project will be *much* better off.
