require("dotenv").config();

const server = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 0,
};

const kafka = {
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID ? process.env.KAFKA_GROUP_ID.toString() : "",
  KAFKA_HOST: process.env.KAFKA_HOST ? process.env.KAFKA_HOST.toString() : "",
  KAFKA_AUTO_COMMIT_ENABLE: process.env.KAFKA_HOST ? !!process.env.KAFKA_HOST : false,
  KAFKA_TOPIC_VALIDATE: process.env.KAFKA_TOPIC_VALIDATE ? process.env.KAFKA_TOPIC_VALIDATE.toString() : "",
  KAFKA_TOPIC_VALIDATE_ANSWER: process.env.KAFKA_TOPIC_VALIDATE_ANSWER ? process.env.KAFKA_TOPIC_VALIDATE_ANSWER.toString() : "",
};

module.exports = {
  server,
  kafka,
};
