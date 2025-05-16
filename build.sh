#!/bin/bash

set -eo pipefail

R=$(pwd)

WP_FLAG="--debug"
WASM=1
SITE=1
CLEAN=0

for arg in "$@"; do
    case $arg in
    -r | --release)
        WP_FLAG="--release"
        ;;
    --no-wasm)
        WASM=0
        ;;
    --no-site)
        SITE=0
        ;;
    --clean)
        CLEAN=1
        ;;
    esac
done

# Build WebAssembly
if [ $WASM -eq 1 ]
then
    cd $R/crates/markov/
    wasm-pack build --target bundler $WP_FLAG

    cd $R/crates/generative-art/
    wasm-pack build --target bundler $WP_FLAG

    cd $R/crates/rast/
    cargo build --target wasm32-unknown-unknown --release
    
    cp $R/crates/rast/target/wasm32-unknown-unknown/release/rast.wasm $R/public

    cargo build --target wasm32-unknown-unknown --release
fi

if [ $SITE -eq 1 ]
then
    cd $R/crates/markov/demo
    pnpm install 
    pnpm build
    cp $R/crates/markov/demo/dist/index.html $R/public/standalonemarkov.html

    cd $R
    pnpm install
    pnpm build
fi

