import { Controller } from '@nestjs/common';
import { AntiFraudService } from './AntiFraudService';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}
}
