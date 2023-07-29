import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TransactionType } from "./entities/transactionType";
import { TransactionStatus } from "./entities/transactionStatus";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(TransactionType)
        private readonly typeRepository: Repository<TransactionType>,
        @InjectRepository(TransactionStatus)
        private readonly statusRepository: Repository<TransactionStatus>,
    ) {}

    async findTypeById(id: number): Promise<TransactionType> {
        return await this.typeRepository.findOneBy({ id });
    }

    async findStatusById(id: number): Promise<TransactionStatus> {
        return await this.statusRepository.findOneBy({ id });
    }
}