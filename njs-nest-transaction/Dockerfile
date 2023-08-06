FROM node:16-alpine

WORKDIR /app

COPY dist /app/dist
#COPY package.json /app

# copy yarn.lock if you are using yarn and node_modules.
#COPY yarn.lock /app
# COPY node_modules /app/node_modules

COPY node_modules /app/node_modules


##COPY . /app

EXPOSE 3000

CMD ["node", "dist/src/main"]

