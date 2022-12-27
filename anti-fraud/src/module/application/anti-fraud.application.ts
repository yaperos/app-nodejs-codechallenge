import { BrokerRepository } from '../domain/repositories/broker.repository'

export class AntiFraudApplication {
  constructor(private readonly brokerRepository: BrokerRepository) {
    this.brokerRepository = brokerRepository
  }

  async receive(): Promise<void> {
    await this.brokerRepository.receive()
  }
}
