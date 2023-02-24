FROM node:16

WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY ./antifraud-microservice/package.json ./antifraud-microservice/yarn.lock ./

# Install dependencies using yarn
RUN yarn install

COPY ./antifraud-microservice .

# Build the application
RUN yarn build

# Start the application
CMD [ "yarn", "start:prod" ]
