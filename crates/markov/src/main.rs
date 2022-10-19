use std::{
    fs::File,
    io::{stdout, BufReader, BufWriter, Stdout, Write, Read},
};

use nalgebra::DVector;

use rand::{rngs::SmallRng, Rng, SeedableRng};

mod common;
use common::*;

const WORDLIST_FILENAME: &str = "./wordlist";
const STOCHASTIC_MATRIX_FILENAME: &str = "./stochastic_matrix";

fn main() {
    let words = if let Ok(mut wordlist_file) = File::open(WORDLIST_FILENAME) {
        eprintln!("Loading wordlist from file...");

        rmp_serde::from_read(BufReader::new(&mut wordlist_file)).unwrap()
    } else {
        eprintln!("Create wordlist from text...");

        let mut text = String::new();
        File::open("./english_source.txt").unwrap().read_to_string(&mut text).unwrap();

        let words =
            load_wordlist_from_text(text.chars());

        let mut wf = BufWriter::new(File::create(WORDLIST_FILENAME).unwrap());
        rmp_serde::encode::write_named(&mut wf, &words).unwrap();

        words
    };

    eprintln!("{} words identified.", words.len());

    let stochastic_matrix =
        if let Ok(mut stochastic_matrix_file) = File::open(STOCHASTIC_MATRIX_FILENAME) {
            eprintln!("Loading stochastic matrix from file...");
            rmp_serde::from_read(BufReader::new(&mut stochastic_matrix_file)).unwrap()
        } else {
            eprintln!("Creating word -> wordlist index map...");
            let word_to_index = make_word_to_index(&words);

            let mut text = String::new();
            
                File::open("./english_source.txt").unwrap().read_to_string(&mut text).unwrap();

            eprintln!("Indexifying text...");
            let indexes = text_to_indexes(
                text.chars(),
                &word_to_index,
            );

            eprintln!("Creating stochastic matrix from text...");
            let stochastic_matrix = create_probability_matrix(&indexes, words.len());
            let mut smf = BufWriter::new(File::create(STOCHASTIC_MATRIX_FILENAME).unwrap());

            rmp_serde::encode::write_named(&mut smf, &stochastic_matrix).unwrap();

            stochastic_matrix
        };

    let mut rng = SmallRng::seed_from_u64(123);
    let mut state = DVector::from_element(stochastic_matrix.ncols(), 0.0);
    let mut stdout = stdout().lock();

    loop {
        state.fill(0.0);
        *state.index_mut(rng.gen_range(0..state.len())) = 1.0;

        for _ in 0..50 {
            state = &stochastic_matrix * state;

            let random = DVector::<f32>::from_fn(state.nrows(), |_, _| rng.gen_range(0.0..=10.0));

            state = state.component_mul(&random);

            let i = condense_vector(&mut state);

            write!(stdout, "{} ", words.get(i).unwrap()).unwrap();
        }
    }
}
