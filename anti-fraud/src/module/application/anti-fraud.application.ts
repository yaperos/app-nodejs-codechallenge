import { TransactionEntity } from '../domain/entities/transaction.entity'
import { BrokerRepository } from '../domain/repositories/broker.repository'

export class AntiFraudApplication {
  constructor(private readonly brokerRepository: BrokerRepository) {
    this.brokerRepository = brokerRepository
  }

  async validateaAmmount(data: unknown): Promise<any> {}

  async receive(): Promise<void> {
    await this.brokerRepository.receive()
  }
}
