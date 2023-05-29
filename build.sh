#!/bin/bash

set -eo pipefail

R=$(pwd)

WP_FLAG="--debug"
WASM=1
SITE=1

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
    esac
done
#
# Build WebAssembly
if [ $WASM -eq 1 ]
then
    cd $R/crates/markov/
    wasm-pack build --target bundler $WP_FLAG

    cd $R/crates/generative-art/
    wasm-pack build --target bundler $WP_FLAG

    cd $R/crates/rast/
    cargo build --target wasm32-unknown-unknown --release
    
    cd $R
    cp $R/crates/rast/target/wasm32-unknown-unknown/release/rast.wasm $R/public

    cd $R/crates/fluid/
    cargo build --target wasm32-unknown-unknown --release
    
    cd $R
    cp $R/crates/fluid/target/wasm32-unknown-unknown/release/fluid.wasm $R/public

fi

if [ $SITE -eq 1 ]
then
    cd $R
    yarn install
    yarn build
fi

