# syntax=docker/dockerfile:1
FROM oven/bun
ARG BUILD_CONTEXT
COPY --from=node:18.10.0-slim /usr/local/bin /usr/local/bin
WORKDIR /shopify-app
COPY . /

WORKDIR /shopify-app/$BUILD_CONTEXT
RUN bun install
CMD bun "$(if [ $DEV = 'true' ] ; then echo 'dev' ; else echo 'start'; fi)"
