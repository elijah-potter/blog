mod common;

use std::collections::HashMap;

use common::*;
use nalgebra::{DMatrix, DVector};
use rand::{rngs::SmallRng, Rng, SeedableRng};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[wasm_bindgen]
pub struct TrainedModel {
    words: Vec<String>,
    word_to_index: HashMap<String, usize>,
    stochastic_matrix: DMatrix<f32>,
}

#[wasm_bindgen]
impl TrainedModel {
    pub fn compute_next_words(
        &self,
        current_word: String,
        max_results: usize,
    ) -> Option<Vec<JsValue>> {
        if let Some(index) = self.word_to_index.get(&current_word) {
            let mut state = DVector::from_element(self.words.len(), 0.0);
            *state.index_mut(*index) = 1.0;

            let mut next_state = &self.stochastic_matrix * state;

            // I know that this is a naive algorithm can probably be simplified.
            let mut result = Vec::with_capacity(max_results.min(self.words.len()));
            for _ in 0..max_results.min(self.words.len()) {
                let imax = next_state.imax();

                if *next_state.index(imax) != 0.0 {
                    result.push(JsValue::from_str(&self.words[imax]));
                }
                *next_state.index_mut(imax) = 0.0;
            }

            Some(result)
        } else {
            None
        }
    }

    pub fn random_next_word(&self, current_word: String, seed: f64) -> Option<String> {
        let mut rng = SmallRng::seed_from_u64(seed as u64);

        if let Some(index) = self.word_to_index.get(&current_word) {
            let mut state = DVector::from_element(self.words.len(), 0.0);
            *state.index_mut(*index) = 1.0;

            let random = DVector::<f32>::from_fn(state.nrows(), |_, _| rng.gen_range(0.0..=1.0));

            let next_state = (&self.stochastic_matrix * state).component_mul(&random);

            Some(self.words[next_state.imax()].clone())
        } else {
            None
        }
    }

    pub fn word_variants(&self) -> usize {
        self.words.len()
    }
}

#[wasm_bindgen]
pub fn train(text: String) -> TrainedModel {
    let words = load_wordlist_from_text(text.chars());

    let word_to_index = make_word_to_index(&words);

    let indexified = text_to_indexes(text.chars(), &word_to_index);

    let stochastic_matrix = create_probability_matrix(&indexified, words.len());

    TrainedModel {
        words,
        word_to_index,
        stochastic_matrix,
    }
}
