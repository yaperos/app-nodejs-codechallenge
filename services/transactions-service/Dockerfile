FROM node:18-alpine

WORKDIR /app

# Set working directory
COPY services/transactions-service/package*.json ./

# Install dependencies
RUN npm install

# Copy files to directory
COPY services/transactions-service .

EXPOSE ${PORT}

# Install pm2
RUN npm i pm2 -g

RUN npm run build

# Start app
CMD ["pm2-runtime","start","pm2.json"]
