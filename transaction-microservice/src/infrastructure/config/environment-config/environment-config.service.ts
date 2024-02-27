import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvironmentConfigService {

    constructor(private configService: ConfigService) { }

    getPort(): number {
        return this.configService.get<number>('port');
    }
}