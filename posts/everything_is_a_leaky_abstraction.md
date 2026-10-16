---
"description": "*in machine learning."
"pubDate": "Fri, 16 Oct 2026 21:08:38 GMT"
"keywords":
  - "LLM"
  - "Machine Learning"
  - "ML"
"image": null
"featured": false
"draft": false
---

# Everything Is a Leaky Abstraction*

_*in machine learning_

One of my favorite blogposts of all time was written Andrej Karpathy nearly ten years ago.
In it, he details how he would require the students of his CS231n Deep Learning class at Stanford to implement the forward and backward passes of neural networks by hand (that is, in Python with NumPy).
Why? 
Because he wanted his students to leave his class with a visceral understanding of backpropagation.
They should know how it works, why it works, and thus how to fix it when it stops working.

It's a great read, and I highly recommend that anyone and everyone interested in ML peruse it.
[You can find it here.](https://karpathy.medium.com/yes-you-should-understand-backprop-e2f06eab496b#.lbzzq2acs)

## Some Sealed Abstractions

There are some things that __are__ sealed abstractions (that is, they are not leaky).
But I do not think any of them exist in the serious study of machine learning.
Some examples include:

- Lossless compression algorithms.
- TCP/IP
- TLS
- PostgreSQL

Sure, with some of these things you occasionally need to understand the underlying system for performance tuning.
But knowledge of the underlying system is rarely the difference between success and failure.

## ML Is Not like Normal Engineering

ML is not that way.
To successfully train a model, you need to have a clear understanding of every aspect of the system, all the way down to how individual weights and biases are updated.
It is not a kind discipline.

Obviously, there is Karpathy's example of backpropagation, but it goes further than that.
Every aspect of model architecture can influence the shape of the cost function optimized via backpropagation, which means every aspect of model architecture is leaky.

I have got the sense that laymen believe that any problem can be solved by throwing a [transformer](https://en.wikipedia.org/wiki/Transformer_(deep_learning)) at it.
If only it were so simple.

Successful use of a transformer (or any model architecture, for that matter) depends on a good understanding of how it works and how it affects the cost function.

## Take Your Time

As with any kind of system with a rube-goldberg level of complexity, it is best to take your time.
Go slow.
Skip that extra pot of coffee.
It's better to be right slowly than wrong very fast.
Understand every aspect of your model and training regimen _before_ you start, not after.
