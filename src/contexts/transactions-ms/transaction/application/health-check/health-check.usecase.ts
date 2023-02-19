import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckUseCase {
    public validate(): string {
        return 'OK';
    }
}
