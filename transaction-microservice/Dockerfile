FROM node:16

WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY ./transaction-microservice/package.json ./transaction-microservice/yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY ./transaction-microservice .

# Build the application
RUN yarn build

# Start the application
CMD [ "yarn", "start:prod" ]
