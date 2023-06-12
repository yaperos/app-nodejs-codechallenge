import { ServiceCommunicationInterface } from '../domain/service-communication.interface';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpService implements ServiceCommunicationInterface {
  async get(url: string): Promise<unknown> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      Logger.error(error.message);
      throw new InternalServerErrorException(
        'An error occurred calling find transaction',
      );
    }
  }
}
