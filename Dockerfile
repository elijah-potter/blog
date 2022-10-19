FROM rust:latest as wasm-build

# Create build directory
RUN mkdir -p /usr/build/
WORKDIR /usr/build/

RUN cargo install wasm-pack

COPY . .

RUN ./build.sh --no-site --release

FROM node:latest

RUN mkdir -p /usr/build/
WORKDIR /usr/build/

COPY --from=wasm-build /usr/build/ /usr/build/

RUN ./build.sh --no-wasm --release

ENTRYPOINT ["yarn", "start"]
