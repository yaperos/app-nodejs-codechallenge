FROM node:18-alpine

RUN npm i -g pnpm
ENV PNPM_HOME=/usr/local/bin

WORKDIR /workspace
COPY package.json /workspace/package.json
COPY tsconfig.json /workspace/tsconfig.json
COPY tsconfig.build.json /workspace/tsconfig.build.json
COPY nest-cli.json /workspace/nest-cli.json
COPY pnpm-lock.yaml /workspace/pnpm-lock.yaml

RUN pnpm i

COPY . .