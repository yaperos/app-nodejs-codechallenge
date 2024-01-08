import {runConsumer} from "./infrastructure/kafka/consumers/anti-fraud-consumer";

runConsumer().then(() => {
    console.log('Anti-fraud-service running')
}).catch()