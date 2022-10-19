#!/bin/bash

set -eo pipefail

R=$(pwd)

WP_FLAG="--debug"
Y_FLAG="development"
WASM=1
SITE=1

for arg in "$@"; do
    case $arg in
    -r | --release)
        WP_FLAG="--release"
        Y_FLAG="production"
        ;;
    --no-wasm)
	WASM=0
	;;
    --no-site)
    	SITE=0
	;;
    esac
done

# Build WebAssembly
if [ $WASM -eq 1 ]
then
	cd $R/crates/markov/
	wasm-pack build --target bundler $WP_FLAG
fi

if [ $SITE -eq 1 ]
then
	cd $R
	yarn install
	yarn build
fi

