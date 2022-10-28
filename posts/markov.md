# Markov Chains

Markov chains, named after their inventor, Andrey Markov, are often used to model sequences of probabilistic events. That is, systems that cannot be modeled deterministically.

## Example

Alice is at the grocery store. For every hour she is there, she has a 70% chance of leaving and going to the planetarium. Conversely, she has a 30% chance of staying.

If Alice is already at the planetarium, she has a 10% chance of leaving and going to the grocery store and a 90% chance of staying.

We can represent these probabilities as a table, where each column belongs to a start location, and each row belongs to a end location:

|                      |                        |                      |
| -------------------- | ---------------------: | -------------------: |
|                      | Start at Grocery Store | Start at Planetarium |
| End at Grocery Store |                    30% |                  10% |
| End at Planetarium   |                    70% |                  90% |

If we already know Alice's location for sure, we can simply perform table lookups to predict her most likely next move.

For example, we _know_ she is at the grocery store right now. So by looking at row 2, column 1, we can be 70% confident she will be at the planetarium next hour.

However, this doesn't work if we aren't sure of her location, or we want to predict more than one hour in advance. How do we predict her next move if we aren't certain of her current location?

In the latter case, we might express her current location as another table.

| Location      | % Alice Present |
| ------------- | --------------: |
| Grocery Store |             25% |
| Planetarium   |             75% |

How do we estimate Alice's location in this new plane of possibility? In particular, how likely will Alice be at the Planetarium next hour?

Since there is a 25% probability Alice is at the grocery store, we multiply that with the probility of her transitioning to the Planetarium: $25\% * 75\%$. Next, we add the result with the probability of being at the Planetarium multiplied with the probability of her staying: $75\% * 90\%$.

In full, $25\% * 75\% + 75\% * 90\% = 85\%$.

To see the probabilities as a table:

| Next Location | Calculation                 | % Alice Present |
| ------------- | --------------------------- | --------------: |
| Grocery Store | $25\% * 30\% + 75\% * 10\%$ |             15% |
| Planetarium   | $25\% * 70\% + 75\% * 90\%$ |             85% |

The keen-eyed among you may have noticed that these operations look a lot like matrix multiplication.

Instead of a table, we may represent these possible transitions as a matrix $T$, and the Alice's current location as a vector $\vec{s}$.

$$
T = \begin{bmatrix}
  0.3 & 0.1 \\
  0.7 & 0.9
\end{bmatrix}
$$

$$
\vec{s} = \begin{bmatrix}
  .25 \\
  .75 \\
\end{bmatrix}
$$

> **Note:** The location of each element remains the same as the table, even if we aren't explicitly labeling the rows and columns.

Finding the next state matrix becomes as easy as multiplying the current location vector $\vec{s}$ by $T$. To find further hours in the future, we do it more than once. For example, to estimate three hours in the future: $TTT\vec{s}$. We can condense this with an exponent: $T^3\vec{s}$ or generalize it to $n$ hours with: $T^n\vec{s}$.

## Application to Text-Completion

The principles above can be applied to a variety of probabilistic situations. Most relavant to this particular webpage, is text completion.

We want to estimate the most likely next word to the user. Given the last word, what are the most likely next words? First, we need a dictionary.

### The Dictionary

It is trivial to build a dictionary from sample text. For the purposes of the explanation, we are going to start with an arbitrary dictionary.

| Index | Word    |
| ----- | ------- |
| 0     | orange  |
| 1     | fruit   |
| 2     | passion |
| 3     | cheese  |
| 4     | not  |
| 5     | is  |

### Building the Transition Matrix

To build our transition matrix, we need to count all the transitions that occur between possible words in our dictionary.

In the interest of performance, my implementation converts the dictionary into a `HashMap<String, usize>`. 

Next, I go through the training text and match each word to it's index in the dictionary, effectively transforming the `String` into a `Vec<usize>`.

For example, the phrase, "passion fruit is not orange, cheese is orange," becomes, `[ 2, 1, 5, 4, 0, 3, 5, 0 ]`.

Next, the implementation iterates through each element in this vector, counting each transition. The counts are stored in another `HashMap` in the interest of performance, but is eventually converted into a matrix $C$. Each row is the output word's index, and the column is the input word's index. 

For example, the transition `"fruit" (index 1) -> "is" (index 5)` occurs exactly once, so we record `1` in column 1, row 5.

$$
C = \begin{bmatrix} 
    0 & 0 & 0 & 0 & 1 & 1 \\
    0 & 0 & 1 & 0 & 0 & 0 \\
    0 & 0 & 0 & 0 & 0 & 0 \\
    1 & 0 & 0 & 0 & 0 & 0 \\
    0 & 0 & 0 & 0 & 0 & 1 \\
    0 & 1 & 0 & 1 & 0 & 0
\end{bmatrix}
$$

Not a very interesting matrix, is it?

Each element needs to be converted into a probability. Take the sum of each column:

$$
\begin{bmatrix} 
    1 & 1 & 1 & 1 & 1 & 2
\end{bmatrix}
$$

Create a diagonal matrix $D$ composed of $\frac{1}{\text{column sum}}$

$$
C = \begin{bmatrix} 
    0 & 0 & 0 & 0 & 1 & 0.5 \\
    0 & 0 & 1 & 0 & 0 & 0 \\
    0 & 0 & 0 & 0 & 0 & 0 \\
    1 & 0 & 0 & 0 & 0 & 0 \\
    0 & 0 & 0 & 0 & 0 & 0.5 \\
    0 & 1 & 0 & 1 & 0 & 0
\end{bmatrix}
$$

To finalize our Markov (a.k.a. transition) matrix $M$, we simply perform:

$$
M = DC
$$

### Using the transition matrix

There are two possible situations: the user is in the process of typing, or they have finished their last word.

The latter is the easiest to implement.

Scan the user's text, and isolate the last word. Perform a lookup on the wordlist to identify it's index. Create a new vector containing `0`s except for that index, which should contain a `1`.

For example, if the last word was 'is',

$$
\vec{s} = \begin{bmatrix}
    0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}
$$

Run it through our transition matrix:

$$
M\vec{s} = \begin{bmatrix} 
  0.5 & 0 & 0 & 0 & 0.5 & 0
\end{bmatrix}
$$

Meaning the most probable next choices are at indices `0` and `4`, which correspond to "orange" and "not" respectively.

This is great for autocomplete. We can simply list the most probable options to the user.

### Text-Generation and Steady State

It would be pretty neat if we could use this method to automagically generate text, right?

#### The Naive Solution

Each iteration, choose the most likely word from the set. Maybe randomize it a bit: choose a random word from the top 5 options.

Unfortunately, there is an issue. All Markov chains are guaranteed to converge on a specific probabilistic state given enough iterations. In order to get text generation to work unpredictably and without converging, we need something a bit more complex.

#### My Solution

Create a square diagonal matrix $R$ with a side length equal to the length of $\vec{s}$. Fill the diagonal elements with random numbers between $0$ and $1$. Then choose the word whose index corresponds with the highest value of $R\vec{s}$

