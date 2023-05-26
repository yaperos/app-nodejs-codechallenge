FROM node:16-alpine
WORKDIR .
# Copy and download dependencies
COPY package.json ./
RUN yarn install

# Copy the source files into the image
COPY . .
CMD yarn start
