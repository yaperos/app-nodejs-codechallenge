import express,{ Request,Response,Express } from 'express'
import { json } from 'body-parser'
import 'dotenv/config'
import transactionRouter from './router/TransactionRouter'
import KafkaConsumer from './commons/utils/KafkaConsumer'
import { KafkaConstants } from './domain/constants/Kafka'

const app:Express = express();
const port= process.env.PORT ||3000;
app.use(json());
app.use("/",transactionRouter);

const kafkaConsumer = new KafkaConsumer();
const init = async()=>{kafkaConsumer.consumirStatus(KafkaConstants.TRANSACTION_EVALUATED_TOPIC);}
init();
app.listen(port,()=>{
    console.log(`Server running at port :${port}`);
});

