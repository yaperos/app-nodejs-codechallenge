/* eslint-disable @typescript-eslint/ban-types */
import cors from 'cors'
import helmet from 'helmet'

import express from 'express'
import { MessageQueueConsumer } from './providers/message-broker-consumer.provider'
import './services/antifraud/events'

const app: express.Application = express()

MessageQueueConsumer.start()

app.use(cors())
app.use(helmet())

export default app
