import dotenv from 'dotenv'
import etc from '../../../libs/etc'

dotenv.config()

const env = {
    App: {
        Stage: process.env.APP_STAGE || etc.Stages.Dev,
        Name: process.env.APP_NAME || "yp-anti-fraud"
    },
    Log: {
        Level: process.env.LOG_LEVEL || etc.Log.Error.Name,
        EnableFile: process.env.LOG_ENABLE_FILE ? process.env.LOG_ENABLE_FILE.toLowerCase() == "true" : false,
        Filename: process.env.LOG_FILENAME || "log.txt",
    },
    Queue: {
        ClientId: process.env.QUEUE_CLIENT_ID || "client_id",
        Brokers: process.env.QUEUE_BROKERS ? process.env.QUEUE_BROKERS.split(",") : ["127.0.0.1:9092"],
        GroupId: process.env.QUEUE_GROUP_ID || "group_id"
    }
}

export default env