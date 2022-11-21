
#  Create the image based on the official Node 12.8.0 image from DockerHub
FROM node:16-alpine as build-stage

# Create and change to the app directory.
WORKDIR /usr/src/exchange

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install app dependencies
RUN npm install yarn
RUN rm package-lock.json
RUN yarn install
# Copy local code to the container image.
COPY . .

#Build the app
# RUN yarn tests:unit
RUN yarn build
#  Create the image based on the official Node 12.8.0 image from DockerHub
FROM node:12.8.0-alpine as production-stage
WORKDIR /usr/src/exchange
COPY --from=build-stage /usr/src/exchange/package.json .
COPY --from=build-stage /usr/src/exchange/dist .
COPY --from=build-stage /usr/src/exchange/node_modules ./node_modules
# # Expose the port the app runs in
EXPOSE 4000

CMD [ "npm", "start" ]
