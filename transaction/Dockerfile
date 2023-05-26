FROM node:16-alpine
WORKDIR .
# Copy and download dependencies
COPY package.json ./
RUN yarn install

# Copy the source files into the image
COPY . .
EXPOSE 3000
CMD yarn start
