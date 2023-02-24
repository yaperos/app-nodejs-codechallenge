FROM node:16

WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY ./api-gateway/package.json ./api-gateway/yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY ./api-gateway .

# Build the application
RUN yarn build

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD [ "yarn", "start:prod" ]
