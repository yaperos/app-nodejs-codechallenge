import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import KafkaConsumerService from '../src/Modules/Transaction/infrastructure/kafka/subscribeToTopic';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req: Request, res: Response) => {
    res.send('Transaction-Service');
});


KafkaConsumerService.start().catch(console.error);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} -- Transaction service`);
});
