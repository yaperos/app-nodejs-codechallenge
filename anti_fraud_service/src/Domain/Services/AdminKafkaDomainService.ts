import { Inject } from '@nestjs/common';
import { AdminKafkaInterfaceRepository } from '../Repository';

export class AdminKafkaDomainService {
  constructor(
    @Inject('AdminKafkaInterfaceRepository')
    private readonly adminKafkaInterfaceRepository: AdminKafkaInterfaceRepository,
  ) {}

  async createTopic() {
    return this.adminKafkaInterfaceRepository.createTopic();
  }
}
