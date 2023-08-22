import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'SuperFlights API v2 - Microservices with NestJs';
  }
}
