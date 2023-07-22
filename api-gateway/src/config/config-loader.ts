export const configLoader = () => {
    return {
        port: Number(process.env.PORT),
        database: {
            host: process.env.DATABASE_HOST|| "postgres",
            port: 5432,
            username: process.env.DATABASE_USERNAME || "postgres",
            password: process.env.DATABASE_PASSWORD || "postgres",
            name: process.env.DATABASE_NAME || "yape",
        },
        kafka: {
            service_name: process.env.KAFKA_SERVICE_NAME || "TRANSACTION_SERVICE",
            client_id: process.env.KAFKA_CLIENT_ID || "transaction",
            host: process.env.KAFKA_HOST || "kafka",
            port: process.env.KAFKA_PORT || 9092,
            group_id: process.env.KAFKA_GROUP_ID || "transaction-consumer"
        }
    }
}