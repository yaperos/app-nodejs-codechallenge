import { RetriveService } from './retrieve.service';
import { ITransaction } from '../transaction/dto/create-anti-fraud-service.dto';
export declare class RetriveController {
    private readonly retriveService;
    constructor(retriveService: RetriveService);
    updateRejected(createAntiFraudServiceDto: ITransaction): Promise<void>;
    updateApproved(createAntiFraudServiceDto: ITransaction): Promise<void>;
}
