import dotenv from 'dotenv';
import Server from './server';
import { runConsumer } from './infraestructure/message/kafka/kafka.consumer';


dotenv.config();


const app=new Server();

app.init();

runConsumer().catch((error) => console.error(`Error in consumer: ${error}`));


app.listenServer();

