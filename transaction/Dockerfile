# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Build the application
COPY . .
RUN npm run build

# Start the application
CMD ["npm", "run", "start:dev"]

# Expose the port the application listens on
EXPOSE 3000