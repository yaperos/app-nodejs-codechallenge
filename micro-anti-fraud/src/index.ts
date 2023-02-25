import { Message } from 'kafka-node'
import { CONFIG } from './utils/environments';
import { AppLogger, configureLogApp } from './utils/logger';
import { YAPE_TASK_CONSUMER } from './kafka/kafka.consumer';
import { yapeTaskProducer } from './kafka/kafka.producer';
import { RESOURCE_TRANSACTION } from './constants/interfaces';
import { validateTransaction } from './services/anti-fraud.service';
import { isTransactionStatusPending } from './utils/index';

configureLogApp();

const logger = AppLogger.getDefaultLogger();

const env = CONFIG.APP.ENVIRONMENT;

logger.info(`Services start in environment ${env}`)

YAPE_TASK_CONSUMER.on('message', (message: Message) => {
    if(message && message.value){
        try {
            let resourceTransaction: RESOURCE_TRANSACTION =  JSON.parse( message.value.toString() ) as RESOURCE_TRANSACTION;
            if( isTransactionStatusPending( resourceTransaction )){
                const resourceTransactionValidate = validateTransaction( resourceTransaction );
                yapeTaskProducer( resourceTransactionValidate )
            }
        } catch (error) {
            console.log("Resource is format invalidate")
        }
    }
})
