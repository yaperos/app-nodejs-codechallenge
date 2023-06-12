import { Injectable } from '@nestjs/common';
import { ServiceCommunicationInterface } from '../domain/service-communication.interface';

@Injectable()
export class FindTransactionService {
  constructor(
    private readonly communicationService: ServiceCommunicationInterface,
  ) {}

  async execute(id: string): Promise<any> {
    const url = `${process.env.TR_SERVICE_HOST}/transaction/${id}`;
    return this.communicationService.get(url);
  }
}
