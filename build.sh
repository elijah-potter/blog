#!/bin/bash

set -eo pipefail

R=$(pwd)

WP_FLAG="--debug"
Y_FLAG="development"

for arg in "$@"; do
    case $arg in
    -r | --release)
        WP_FLAG="--release"
        Y_FLAG="production"
        ;;
    esac
done

# Build WebAssembly
cd $R/crates/markov/
wasm-pack build --target bundler $WP_FLAG

cd $R
yarn install
yarn build
