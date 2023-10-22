# Use the official Node.js image as a base image
FROM node:18.18.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Expose the port that your NestJS application is running on
EXPOSE 3000

RUN npm run build

# Command to run your NestJS application
CMD ["npm", "run", "start:prod"]