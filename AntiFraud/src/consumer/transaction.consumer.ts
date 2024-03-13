import { kafka } from '../index';
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();



export const transactionConsumer = async () => {
    const consumer = await kafka.consumer({ groupId: process.env.KAFKA_GROUP || 'antifraud' })
    
    
    await consumer.connect()
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC!, fromBeginning: true })
    
    await consumer.run({
        eachMessage: async ({ message }) => {
            if ( message.value ){
                const messageValue =  message.value.toString();
                const { id, value } = JSON.parse( messageValue )
                value > 1000 ?
                 await axios.put( `${process.env.ROUTE_SERVER}/${id}?idStatus=3` ) :
                 await axios.put( `${process.env.ROUTE_SERVER}/${id}?idStatus=2` )
            }
        },
    })
};





