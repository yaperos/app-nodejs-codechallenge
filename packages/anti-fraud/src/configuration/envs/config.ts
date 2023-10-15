export default () => ({
  kafka: {
    broker: process.env.KAFKA_BROKER || "localhost:9092",
  },
});
