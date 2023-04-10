require('dotenv').config();

export default {
  kafka: {
    host: process.env.KAFKA_HOST,
  },
};
