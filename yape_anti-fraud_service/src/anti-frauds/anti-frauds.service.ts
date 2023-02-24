import { Injectable } from '@nestjs/common';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';
import { UpdateAntiFraudDto } from './dto/update-anti-fraud.dto';

@Injectable()
export class AntiFraudsService {
  create(createAntiFraudDto: CreateAntiFraudDto) {
    return 'This action adds a new antiFraud';
  }

  findAll() {
    return `This action returns all antiFrauds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} antiFraud`;
  }

  update(id: number, updateAntiFraudDto: UpdateAntiFraudDto) {
    return `This action updates a #${id} antiFraud`;
  }

  remove(id: number) {
    return `This action removes a #${id} antiFraud`;
  }
}
