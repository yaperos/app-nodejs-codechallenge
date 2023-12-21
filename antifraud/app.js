var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');


const { Kafka } = require('kafkajs');
const clientId = process.env.CLIENT_ID;
const brokers = [process.env.BROKER];
const producer_topic = process.env.PRODUCER_TOPIC;
const consumer_topic = process.env.CONSUMER_TOPIC;
const kafka = new Kafka({ clientId, brokers });

const consumer = kafka.consumer({ groupId: clientId });
const producer = kafka.producer();

const produce = async (id, data) => {
  await producer.connect();
  // console.log("data: ", data, JSON.stringify(data));
  await producer.send({
    topic: producer_topic,
    messages: [
      {
        key: id,
        value: JSON.stringify(data),
      },
    ],
  });
  await producer.disconnect();
};

const consume = async () => {
    // first, we wait for the client to connect and subscribe to the given topic
    await consumer.connect();
    await consumer.subscribe({ topic: consumer_topic });
    await consumer.run({
      // this function is called every time the consumer gets a new message
      eachMessage: ({ message }) => {
        // here, we just log the message to the standard output
        setTimeout(() => {
          const scoreValue = [700, 800, 900, 1000, 1100] 
          const scoreIndex = Math.floor(Math.random() * scoreValue.length)

          const id = message.key.toString()
          produce(id, { id, score: scoreValue[scoreIndex] })
        }, 2000)
      },
    });
  };



  consume().catch((error) => {
    console.error("error in consumer: " + error )
  })

var app = express();

app.use('/', indexRouter);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
