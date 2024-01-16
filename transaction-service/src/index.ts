import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import KafkaConsumerService from '../src/Modules/Transaction/infrastructure/kafka/subscribeToTopic';
import transactionRoutes from '../src/Modules/Transaction/infrastructure/Routes/TransactionRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4001;

/* Routes */
app.use(transactionRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Transaction-Service');
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'up' });
});

/* End of Routes */

KafkaConsumerService.start().catch(console.error);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} -- Transaction service`);
});
