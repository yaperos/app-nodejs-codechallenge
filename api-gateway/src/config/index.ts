export const config = {
    KAFKA_BROKER: process.env.KAFKA_BROKER || '',
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENTID || '',

    DB_HOST: process.env.DB_HOST || '',
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_PORT: process.env.DB_PORT || '',
    DB_NAME: process.env.DB_NAME || ''
}