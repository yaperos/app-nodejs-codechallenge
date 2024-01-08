FROM node:18-alpine

WORKDIR /app

# Set working directory
COPY services/anti-frauds-service/package*.json ./

# Install dependencies
RUN npm install

# Copy files to directory
COPY services/anti-frauds-service .

EXPOSE ${PORT}

# Install pm2
RUN npm i pm2 -g

RUN npm run build

# Start app
CMD ["pm2-runtime","start","pm2.json"]
