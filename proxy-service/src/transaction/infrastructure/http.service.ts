import { ServiceCommunicationInterface } from '../domain/service-communication.interface';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpService implements ServiceCommunicationInterface {
  async get(url: string, params = {}): Promise<unknown> {
    try {
      return axios.get(url, params);
    } catch (error) {
      Logger.error(error.message);
      throw new InternalServerErrorException(
        'An error occurred calling find transaction',
      );
    }
  }
}
