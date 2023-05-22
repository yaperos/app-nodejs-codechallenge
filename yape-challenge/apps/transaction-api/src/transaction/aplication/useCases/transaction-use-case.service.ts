import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ITransactionRepository } from "../../domain/repositories/transaction.repository.interface";
import { CreateTransactionDTO } from "../dtos/create-transaction.dto";
import { TransactionDTO } from "../dtos/transaction.dto";
import { ITransactionUseCasesPort } from "../useCasesPorts/transaction-use-cases.port";
import { GetTransactionDTO } from "../dtos/get-transaction.dto";
import moment from 'moment-timezone';
import { TransactionConst } from "../const/transaction.const";

@Injectable()
export class TransactionUseCasesService implements ITransactionUseCasesPort {

    constructor(@Inject('TransactionRepository') private transactionRepository: ITransactionRepository) {}

    public async getById(id: string): Promise<TransactionDTO> {
        const response = await this.transactionRepository.getById(id);
        if (!response) throw new NotFoundException("Transaction not found");

        return new TransactionDTO(response)
    }

    public async create(dto: CreateTransactionDTO): Promise<TransactionDTO> {
        const entity: any = {
            status: TransactionConst.status.pending,
            accountExternalIdCredit: dto.accountExternalIdCredit,
            accountExternalIdDebit: dto.accountExternalIdDebit,
            value: dto.value,
            tranferTypeId: dto.tranferTypeId,
            createdAt: moment(new Date()).format('yyyy-MM-DD')
        };
        const response = await this.transactionRepository.create(entity);

        return new TransactionDTO(response);
    }

    public async update(id: string, status: string): Promise<TransactionDTO> {
        const entity = await this.transactionRepository.getById(id);
        if (!entity) throw new NotFoundException("Transaction not found");

        entity.status = status;
        entity.updatedAt = moment(new Date()).format('yyyy-MM-DD');

        const response = await this.transactionRepository.update(entity);
        return new TransactionDTO(response);
    }

    public async get(dto: GetTransactionDTO): Promise<TransactionDTO[]> {
        const { transactionStatus, tranferTypeId, createdAt } = dto;
        const response = await this.transactionRepository.get(transactionStatus, tranferTypeId, createdAt);
        return response.map(item => {
            return new TransactionDTO(item);
        })
    }
    
}