FROM rust:latest AS wasm-build

RUN mkdir -p /usr/build/
WORKDIR /usr/build/

RUN cargo install wasm-pack --version 0.13.1

COPY . .

RUN ./build.sh --no-site --release

# Clean up unneeded build artifacts
WORKDIR /usr/build/crates/

FROM node:lts-slim AS node-build

RUN mkdir -p /usr/build/
WORKDIR /usr/build/

COPY --from=wasm-build /usr/build/ /usr/build/

RUN corepack enable
RUN ./build.sh --no-wasm --release

ENTRYPOINT ["pnpm", "start", "-p", "3000", "-H", "0.0.0.0"]
