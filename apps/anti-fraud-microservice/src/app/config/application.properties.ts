import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApplicationProperties {

    constructor(
        private readonly configService: ConfigService
    ){}

    getMaxPermitedAmount() : number {
        return this.configService.get<number>('application.max-amount-allowed');
    }
}