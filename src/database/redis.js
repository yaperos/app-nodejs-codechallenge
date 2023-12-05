const Redis = require("ioredis");
require("dotenv").config();

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;

const redisClient = new Redis({
  host,
  port,
});

module.exports = redisClient;
