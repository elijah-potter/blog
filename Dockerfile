FROM rust:latest as wasm-build

RUN mkdir -p /usr/build/
WORKDIR /usr/build/

RUN cargo install wasm-pack

COPY . .

RUN ./build.sh --no-site --release

FROM node:latest as node-build

RUN mkdir -p /usr/build/
WORKDIR /usr/build/

COPY --from=wasm-build /usr/build/ /usr/build/

RUN ./build.sh --no-wasm --release

FROM node:latest

RUN mkdir -p /app
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=node-build /usr/build/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=node-build --chown=nextjs:nodejs /usr/build/.next/standalone ./
COPY --from=node-build --chown=nextjs:nodejs /usr/build/.next/static ./.next/static

RUN npm install sharp

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["node", "server.js"]
