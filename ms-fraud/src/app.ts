import express,{ Request,Response,Express } from 'express'
import { json } from 'body-parser'
import 'dotenv/config'
import KafkaConsumer from './commons/utils/KafkaConsumer'
import { KafkaConstants } from './domain/constants/Kafka'
import path from 'path'

const app:Express = express();
const port= process.env.PORT ||3001;
app.use(json());
app.get("/",(req,res,next)=>{
    res.send('server up')
});

const kafkaconsumer= new KafkaConsumer();
const init = async()=>{kafkaconsumer.consumirStatus(KafkaConstants.TRANSACTION_PENDGING_TOPIC);}
init();
app.listen(port,()=>{
    console.log(`Server running at port :${port}`);
});

