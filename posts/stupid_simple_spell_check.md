# Stupid-Simple Spell-Check

![A sign advertising for antiques, but misspelled.](/images/antiques.webp)

For the last month, I've been spending a lot of time replacing one key component
of my writing and programming environment: my grammar checker.

Up until now, I've been using the eponymous [LanguageTool](https://languagetool.org/)
via [`ltex-ls`](https://github.com/valentjn/ltex-ls) and [`nvim-lspconfig`](https://github.com/neovim/nvim-lspconfig).
Don't get me wrong, these tools are _really good,_ and I would recommend them to anyone and everyone.
However, they come with a few key annoyances.

## LanguageTool Grievances

### Performance

LanguageTool is slow.
I'm not exactly sure why.
Every time I would run LanguageTool over my Markdown or $\LaTeX$ documents (which are reasonably sized),
I would have to wait several seconds before even the rudimentary spell-checking would show up.

Additionally, I would find `ltex-ls` regularly becoming the most memory-hungry application on my laptop,
often exceeding 4 gigabytes.

After hours of scouring their code base, I have come to no better explanation
than that it is written in Java.
There are a couple questionable algorithmic decisions in there as well.

### Download Size

As I said: LanguageTool is really quite good.
However, to get everything it can offer, you need to not only install a Java Runtime
Environment (>150 MB on my system), the actual `.jar` file (>300 MB), but you also need to download
a 16 GB n-gram dataset.

## Grammarly Grievances

"But Elijah," I hear you say, "just use Grammarly!"

**No.** I'm not going to drop $12 a month for something even slower and worse.
Not to mention how they are likely going to use my work to train their large language models.
Grammarly is a great product, just not for me.

## The Algorithm

Now that I've thoroughly explained my reasoning for implementing a new grammar checker (one that I'm calling [Harper](https://github.com/elijah-potter/harper)), I'd like to recount
my first, admittedly naive, attempt at spellchecking.

The first idea we need to get a grip on is _Levenshtein edit distance._
In essence, edit distance is the least number of single-character edits (insertions, deletions or replacements) necessary to turn one word into another.
For example, the edit distance between "cat" and "bat" is one; the only edit involves replacing the "c" with a "b".

Similarly, the edit distance between "kitten" and "sitting" is three: remove the "g", replace the second "i" with an "e" and replace the "s" with a "k".
For this naive spellchecking, we aren't too concerned with the exact edits (atomic errors) that occur in a given misspelling, only the magnitude of the error.

From a high level view here's how the algorithm is going to work:

1. Determine _whether_ a given word is misspelled.
   If not, exit.
1. Calculate the Levenshtein edit distance between the misspelled word and all valid English words.
1. Pick the three words with the shortest edit distance and present them to the user as alternative
   spelling options.

### Step 1.

To determine whether a given word is misspelled, we will need a list of all the valid words in the English language.
Turns out, this isn't too easy.
For today, we will just use a subset of the English language with this short list:

```
into
the
a
cat
tree
jumped
```

To check if a given word is within the list, we can place the list into a hash set,
and grab it's contents.

```rust
let words: Vec<String> = vec!["into", "the", "a", "cat", "tree", "jumped"]
    .into_iter()
    .map(|s| s.to_string())
    .collect();

let word_set: HashSet<String> = words.iter().cloned().collect();

let word = "thw";
let word_chars: Vec<_> = word.chars().collect();

if word_set.contains(word) {
    println!("It is a valid English word!");
    return;
}

println!("Are you sure you meant to spell \"{}\" that way?", word);
```

### The Wagner-Fischer Algorithm

Now that we know our word is actually misspelled, we can move on to finding the correct spelling.
We need to find the edit distance between the misspelled word and all the words in our set.

To do this, we will be using the [Wagner-Fischer](https://en.wikipedia.org/wiki/Wagner%E2%80%93Fischer_algorithm) algorithm.

```rust
// Computes the Levenstein edit distance between two patterns.
// This is accomplished via the Wagner-Fischer algorithm
fn edit_distance(source: &[char], target: &[char]) -> u8 {
    let m = source.len();
    let n = target.len();

    // Create an m-by-n matrix.
    let mut d = create_empty_matrix(m + 1, n + 1);

    // Since we know we can transform each word into the other by replacing
    // successive characters (or deleting them), we can fill the first column and
    // row with values from 0..m and 0..n, respectively.
    for i in 0..=m {
        d[i][0] = i as u8;
    }

    for i in 0..=n {
        d[0][i] = i as u8;
    }

    for j in 1..=n {
        for i in 1..=m {
            // The total edit distance of two given letter indices i and j, one from each word
            // will be the sum of the edit distances of prior combinations + whether the characters
            // at the two indices are equal.

            let cost = if source[i - 1] == target[j - 1] { 0 } else { 1 };
            d[i][j] = (d[i - 1][j] + 1)
                .min(d[i][j - 1] + 1)
                .min(d[i - 1][j - 1] + cost);
        }
    }

    // After all possible edits have been explored and minimized
    // the resulting minimum edit distance will be in the final item in the matrix.
    d[m][n]
}

// Create an empty matrix of size [m, n]
fn create_empty_matrix(m: usize, n: usize) -> Vec<Vec<u8>> {
    let mut d = Vec::with_capacity(m);

    for _ in 0..m {
        d.push(vec![0u8; n]);
    }

    d
}
```

This works pretty well.
There are a number of optimizations we could apply to this function alone.
I'll leave that as a problem for the reader, since they aren't particularly relevant to the meat of the larger algorithm.

### Steps 2 + 3

Now that we can determine the edit distance between two words, we can perform a brute-force search.
In this short example, we're going to use `sort_by_key` to do this, since our data set is so small.
If we were working with a larger dictionary (say, the entire English language), there would be a number of things we would need to do to reduce time and memory consumption.

```rust
let mut suggestions: Vec<(String, u8)> = words
    .into_iter()
    .filter_map(|possible_word| {
        let possible_chars: Vec<_> = possible_word.chars().collect();

        let dist = edit_distance(word_chars.as_slice(), &possible_chars);

        if dist <= 2 {
            Some((possible_word, dist))
        } else {
            None
        }
    })
    .collect();

suggestions.sort_by_key(|(_, d)| *d);

println!("Possible alternatives: ");

suggestions.iter().for_each(|(s, _)| println!("- {}", s));
```

If we run the whole program again, we get an output something like:

```output
Are you sure you meant to spell "thw" that way?
Possible alternatives:
- the
```

That looks pretty good to me!

If you would like to look at the whole program, and maybe try out your own inputs, [go right on ahead](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=fb7910ad1fb3a6c944cbc2ae8659bb31).
