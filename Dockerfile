FROM rust:latest as wasm-build

RUN mkdir -p /usr/build/
WORKDIR /usr/build/

RUN cargo install wasm-pack

COPY . .

RUN ./build.sh --no-site --release --clean

# Clean up unneeded build artifacts
WORKDIR /usr/build/crates/
RUN find -maxdepth 2 -name target -exec rm -r {} +

FROM node:slim as node-build

RUN mkdir -p /usr/build/
WORKDIR /usr/build/

COPY --from=wasm-build /usr/build/ /usr/build/

RUN ./build.sh --no-wasm --release

ENTRYPOINT ["yarn", "start", "-p", "3000", "-H", "0.0.0.0"]
