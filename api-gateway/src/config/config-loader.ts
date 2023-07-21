export const configLoader = () => {
    return {
        port: Number(process.env.PORT),
        database: {
            host: String(process.env.DATABASE_HOST),
            port: Number(process.env.DATABASE_PORT),
            username: String(process.env.DATABASE_USERNAME),
            password: String(process.env.DATABASE_PASSWORD),
            name: String(process.env.DATABASE_NAME),
        },
        kafka: {
            service_name: String(process.env.KAFKA_SERVICE_NAME),
            client_id: String(process.env.KAFKA_CLIENT_ID),
            host: String(process.env.KAFKA_HOST),
            port: Number(process.env.KAFKA_PORT),
            group_id: String(process.env.KAFKA_GROUP_ID)
        }
    }
}