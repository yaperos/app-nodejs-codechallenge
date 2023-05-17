import { AntiFraudServiceService } from './anti-fraud-service.service';
import { CreateAntiFraudServiceDto } from './dto/create-anti-fraud-service.dto';
export declare class AntiFraudServiceController {
    private readonly antiFraudServiceService;
    constructor(antiFraudServiceService: AntiFraudServiceService);
    create(createAntiFraudServiceDto: CreateAntiFraudServiceDto): void;
}
