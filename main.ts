import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import { KafkaClient, Producer, ProduceRequest, Consumer } from 'kafka-node';
import { DatabaseImplementation } from "./app/src/infraestructure/implementations/cacheDatabase.implementation"

const app = express()
const router = express.Router()
const databaseImplementation = new DatabaseImplementation()
const PORT = 3001

const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(kafkaClient);
app.use(bodyParser.json())

router.post('/transaction', async (req: Request, res: Response) => {
    const transaction = req.body;
    const payloads: ProduceRequest[] = [{ topic:"transaction", messages: await databaseImplementation.process(transaction) }];
    producer.send(payloads, (error: any, data: any) => {
      if (error) {
        console.error('Error sending message:', error);
      } else {
        console.log('Message sent:', payloads);
      }
    });


    const consumer = new Consumer(
        kafkaClient,
        [{ topic: "transaction", partition: 0 }],
        { autoCommit: true }
      );
      
      consumer.on('message', (message: any) => {
        
        res.json({ response:JSON.stringify(message)});
      });
      
      consumer.on('error', (error:any) => {
        console.error('Error in Kafka Consumer:', error);
        res.status(500).json({ error: 'Error sending message' });
      });
  });


app.use('/v2', router)

app.listen(PORT, ()=>{
    console.log(`Runing on port ${PORT}`)
})