const envDevelopment = {
  NODE_ENV: "development",
  PORT: 3000,
  KAFKA_BROKERS: "localhost:9092",
  TOPIC_VALIDATE_TXN: "validate-txn",
  DS_TYPE: "postgres",
  DS_HOST: "localhost",
  DS_PORT: 5432,
  DS_USERNAME: "postgres",
  DS_PASSWORD: "p0stgr3s",
  DS_DATABASE: "test",
}
const envProduction = {
  NODE_ENV: "production",
  PORT: 3000,
  KAFKA_BROKERS: "localhost:9092",
  TOPIC_VALIDATE_TXN: "validate-txn",
  DS_TYPE: "postgres",
  DS_HOST: "localhost",
  DS_PORT: 5432,
  DS_USERNAME: "postgres",
  DS_PASSWORD: "p0stgr3s",
  DS_DATABASE: "test"
}

module.exports = {
  apps : [{
    name: "ms-txn",
    cwd: "./apps/ms-txn",
    script: "dist/index.js",
    env: envProduction,
    env_development: envDevelopment
  }, {
    name: "ms-antifraud",
    cwd: "./apps/ms-antifraud",
    script: "dist/index.js",
    env: envProduction,
    env_development: envDevelopment
  }]
}