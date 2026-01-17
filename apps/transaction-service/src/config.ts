export const config = {
    port: Number(process.env.PORT || 3000),
    databaseUrl: process.env.DATABASE_URL!,
    kafkaBrokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(",")
};
