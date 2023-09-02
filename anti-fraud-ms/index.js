const { sequelize } = require('./models');
const kafka = require('kafka-node');
const { transaction } = require('./models');

const client = new kafka.KafkaClient({kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS});
const consumer = new kafka.Consumer(client, [{topic: process.env.KAFKA_TOPIC}],{autoCommit: false});
console.log(`Consumer of topic ${process.env.KAFKA_TOPIC} running...`);

consumer
    .on('message', async (message) => {
        console.log(`Received message: ${message.value}`);
        const transactionMsg = JSON.parse(message.value);
        console.log(transactionMsg);
        
        await sequelize.authenticate();
        console.log('Database connected!');

        const resTransaction = await transaction.findOne({
            where: { id: transactionMsg.id },
        });

        if(resTransaction){
            if(resTransaction.value>1000) resTransaction.status = 'REJECTED';
            else resTransaction.status = 'APPROVED';

            await resTransaction.save()
            console.log(`Transaction ${resTransaction.id} updated with ${resTransaction.status}!`);
        }
    })
    .on('error', (error) => console.log(`Error: ${error}`));
