import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthcheckService {
  private readonly logger: Logger = new Logger(HealthcheckService.name);

  printMessage(message: any): void {
    this.logger.log(message);
  }
}
