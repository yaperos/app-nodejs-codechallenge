export const config = {
    kafkaBrokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(",")
};
