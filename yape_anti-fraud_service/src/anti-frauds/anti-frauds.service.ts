import { Injectable } from '@nestjs/common';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';
import { UpdateAntiFraudDto } from './dto/update-anti-fraud.dto';

@Injectable()
export class AntiFraudsService {
  create(createAntiFraudDto: CreateAntiFraudDto) {
    return 'This action adds a new antiFraud';
  }
}
