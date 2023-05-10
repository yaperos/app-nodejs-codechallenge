import express, { Express } from 'express';
import cors from 'cors'
import { route } from './infrastructure/express/route';
import { consumerRun } from './infrastructure/kafka/consumer';
import { CONSUMER_GROUP_ID, CONSUMER_TOPIC, PORT } from './shared/config';


const app: Express = express();
app.use(express.json());
app.use(cors());
app.use("/transaction", route);

consumerRun()
console.log(`Consumer running Topic:${CONSUMER_TOPIC} , ConsumerGroupId: ${CONSUMER_GROUP_ID}`);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});