export default () => ({
  kafka: {
    uri: process.env.KAFKA_URI,
    consumerName: process.env.KAFKA_ANTI_FRAUD_CONSUMER,
  },
  limitAmount: process.env.LIMIT_AMOUNT,
});
