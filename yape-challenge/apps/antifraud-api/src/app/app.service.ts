import { Injectable } from '@nestjs/common';
import { AntiFraudeDTO } from './dtos/anti-fraude.dto';

@Injectable()
export class AppService {

  public antiFraudVerify(transactionEvent: AntiFraudeDTO) {
    const { value } = transactionEvent;
    return value > 1000 ? 'rejected' : 'approved';
  }
}
