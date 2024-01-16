import { Logger } from '../Logger';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class KafkaProducerService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  async sendToKafkaService(message: unknown) {
    try {
      this.logger.debug('Sending message to Go service...');
      const response = await axios.post(process.env.GO_MESSAGES_SERVER_URL || 'http://localhost:4005/send', message);
      this.logger.debug('Message successfully sent: ' + JSON.stringify(response.data));
    } catch (error) {
      this.logger.error('Error sending message to Go service: ' + error);
    }
  }
}

export default KafkaProducerService;
