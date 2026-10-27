FROM oven/bun:1
FROM olbat/cupsd:latest

USER root
RUN apt-get update && apt-get install -y --no-install-recommends cups-client

WORKDIR /app
