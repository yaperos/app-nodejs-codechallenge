import dotenv from 'dotenv'
import etc from '../../../libs/etc'

dotenv.config()

const env = {
    App: {
        Port: process.env.APP_PORT || 3000,
        Stage: process.env.APP_STAGE || etc.Stages.Dev,
        Name: process.env.APP_NAME || "service-transaction"
    },
    Log: {
        Level: process.env.LOG_LEVEL || etc.Log.Error.Name,
        EnableFile: process.env.LOG_ENABLE_FILE ? process.env.LOG_ENABLE_FILE.toLowerCase() == "true" : false,
        Filename: process.env.LOG_FILENAME || "logger.txt",
    },
    Db: {
        Host: process.env.DB_HOST || "127.0.0.1",
        Port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        Username: process.env.DB_USERNAME || "root",
        Password: process.env.DB_PASSWORD || "admin",
        Database: process.env.DB_DATABASE || "test",
        Sync: process.env.DB_SYNC ? process.env.DB_SYNC.toLowerCase() == "true" : false,
        Logging: process.env.DB_LOGGING ? process.env.DB_LOGGING.toLowerCase() == "true" : false,
    },
    Queue: {
        ClientId: process.env.QUEUE_CLIENT_ID || "client_id",
        Brokers: process.env.QUEUE_BROKERS ? process.env.QUEUE_BROKERS.split(",") : ["127.0.0.1:9092"],
        GroupId: process.env.QUEUE_GROUP_ID || "group_id"
    }
}

export default env