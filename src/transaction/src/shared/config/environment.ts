import * as dotenv from "dotenv"
dotenv.config()

const PORT: string = process.env.PORT!
const POSTGRES_URI: string = process.env.POSTGRES_URI!
const PRODUCER_TOPIC: string = process.env.PRODUCER_TOPIC!
const CONSUMER_TOPIC: string = process.env.CONSUMER_TOPIC!
const KAFKA_BROKER: string = process.env.KAFKA_BROKER!
const CONSUMER_GROUP_ID: string = process.env.CONSUMER_GROUP_ID!

export {
    PORT,
    POSTGRES_URI,
    PRODUCER_TOPIC,
    CONSUMER_TOPIC,
    KAFKA_BROKER,
    CONSUMER_GROUP_ID
}