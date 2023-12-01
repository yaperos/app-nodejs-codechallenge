import { config as appCOnfig } from 'dotenv'

appCOnfig()

export const config = {
    env: process.env.NODE_ENV || 'fix node env',
    app: {
        port: parseInt(process.env.PORT) || 4000,
        host: process.env.HOST || '0.0.0.0',
    },
    databaseUrl: process.env.BROWSER_URI || 'postgres://postgres:postgres@localhost:5432/postgres',
    kafka: {
        uri: process.env.KAFKA_URL || 'localhost:9092',
        clientId: process.env.KAFKA_CLIENT_ID || 'CLIENT_ID_1234',
        groupId: process.env.KAFKA_GROUP_ID || 'GROUP_ID_1234',
    },
}
