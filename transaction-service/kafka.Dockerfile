# Base image
FROM node:20.9.0-alpine as intermediate
# A wildcard is used to ensure both package.json AND yarn.lock are copied
COPY package.json yarn.lock ./
# Install app dependencies `npm install
RUN yarn install

# Base image for start the server
FROM node:19.4.0-alpine
# Implements a simple process supervisor
RUN apk add dumb-init
# Create the work directory
RUN mkdir -p /transaction-service/src/app
# Set the work directory
WORKDIR /transaction-service/src/app
# Bundle app source
COPY . /transaction-service/src/app
COPY .env.production ./.env
# Bundle app source
COPY --from=intermediate ./node_modules ./node_modules
# Creates a "dist" folder with the production build
RUN npm run build
# Expose the port for request
EXPOSE 8080
# Set timezone UTC
ENV TZ UTC
# Delete unused directories
RUN rm -rf test
# Start the server using the production build
CMD ["dumb-init", "node", "dist/worker.js"]
