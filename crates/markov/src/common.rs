use std::collections::HashSet;
use std::hash::Hash;
use std::collections::HashMap;

use nalgebra::{DMatrix, DVector};

const IGNORE_CHARS: &str = "—“”‘’,!;:.*_{}()";

pub fn create_probability_matrix(indexes: &[usize], words: usize) -> DMatrix<f32> {
    let mut counts = HashMap::new();

    for i in 0..indexes.len() {
        let index = indexes[i];

        if let Some(peek) = indexes.get(i + 1) {
            counts
                .entry(index)
                .and_modify(|c: &mut HashMap<usize, f32>| {
                    c.entry(*peek)
                        .and_modify(|counter| *counter += 1.0)
                        .or_insert(1.0);
                })
                .or_insert_with(|| {
                    let mut new = HashMap::new();
                    new.insert(*peek, 1.0);
                    new
                });
        }
    }

    let mut count_matrix = DMatrix::from_element(words, words, 0.0);

    for (from, possible_tos) in counts {
        for (to, count) in possible_tos {
            let e = count_matrix.index_mut((to, from));
            *e = count;
        }
    }

    let sums = count_matrix.column_sum();
    let t = DVector::from_fn(sums.len(), |row, _column| {
        let s = sums[row];
        if s == 0.0 {
            0.0
        } else {
            1.0 / s
        }
    });
    let m = DMatrix::from_diagonal(&t);

    m * count_matrix
}

/// Convert text to a series of indexes into a wordlist
pub fn text_to_indexes(
    input: impl IntoIterator<Item = char>,
    word_to_index: &HashMap<String, usize>,
) -> Vec<usize> {
    let mut word = String::new();
    let mut indexes = Vec::new();

    for c in input.into_iter() {
        if c.is_whitespace() || IGNORE_CHARS.contains(c) {
            if word.len() > 0 {
                if let Some(index) = word_to_index.get(&word) {
                    indexes.push(*index)
                }
                word.clear();
            }
        } else {
            word.push(c.to_lowercase().next().unwrap());
        }
    }

    if let Some(index) = word_to_index.get(&word) {
        indexes.push(*index)
    }

    indexes
}

/// Create a HashMap to convert words to indexes in a wordlist
pub fn make_word_to_index<T>(set: &[T]) -> HashMap<T, usize>
where
    T: Hash + Clone + Eq,
{
    let mut index = HashMap::with_capacity(set.len());

    for (i, el) in set.iter().enumerate() {
        index.insert(el.clone(), i);
    }

    index
}

pub fn load_wordlist_from_text(input: impl IntoIterator<Item = char>) -> Vec<String> {
    let mut word = String::new();
    let mut dictionary = HashSet::new();

    for c in input.into_iter() {
        if c.is_whitespace() || IGNORE_CHARS.contains(c) {
            if word.len() > 0 {
                dictionary.insert(word.clone());
                word.clear();
            }
        } else {
            word.push(c.to_lowercase().next().unwrap());
        }
    }

    dictionary.into_iter().collect()
}

/// Condenses a vector such that the cell that contained the previously largest value = 1.0 while
/// everything else = 0.0.
/// Returns the index of the condensed cell
pub fn condense_vector(vector: &mut DVector<f32>) -> usize {
    let imax = vector.imax();
    vector.fill(0.0);
    vector[imax] = 1.0;
    imax
}
