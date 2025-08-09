import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

/* Project */
import { AntifraudProto } from '../../common/constants/grpc.constants';
import { AntiFraudService } from './anti-fraud.service';

@Controller(AntifraudProto.package)
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @GrpcMethod(AntifraudProto.service, 'Ping')
  ping() {
    const message = this.antiFraudService.ping();

    return {
      message,
    };
  }
}
