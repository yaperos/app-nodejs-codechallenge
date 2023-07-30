FROM node:18-alpine as base

RUN npm i -g pnpm
ENV PNPM_HOME=/usr/local/bin

WORKDIR /workspace

COPY package.json /workspace/package.json
COPY tsconfig.build.json /workspace/tsconfig.build.json
COPY tsconfig.prod.json /workspace/tsconfig.json
COPY nest-cli.json /workspace/nest-cli.json
COPY pnpm-lock.yaml /workspace/pnpm-lock.yaml

FROM base as local

RUN pnpm i