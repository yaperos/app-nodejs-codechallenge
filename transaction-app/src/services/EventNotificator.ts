import { Event } from '../contracts/Event';
import { kafkaProducer } from '../libs/kafka';
import logger from '../libs/logger';

export class EventNotificator {
  constructor() {}
  notify(event: Event) {
    logger.debug(`Creating event ${event.name}`);
    const producer = kafkaProducer.get();
    producer
      .send({
        topic: event.name,
        messages: [{ value: JSON.stringify(event.message) }],
      })
      .then(() => {
        logger.debug(`Event ${event.name} created`);
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }
}
