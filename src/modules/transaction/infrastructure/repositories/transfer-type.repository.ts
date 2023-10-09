import { Repository } from "typeorm";
import { ITransferTypeRepository } from "../../domain/interfaces/repositories/transfer-type.repository.interface";
import { TransferTypeEntity } from "../persistence/typeorm/entities";
import { TransactionsDataSource } from "../../../../adapters/infrastructure/db";
import { TransferType } from "../../domain/entities/transfer-type.entity";

export class TransferTypeRepository implements ITransferTypeRepository {
    private repository: Repository<TransferTypeEntity>;

    constructor() {
        this.repository = TransactionsDataSource.getRepository(TransferTypeEntity);
    }

    public async findOneById(id: number): Promise<TransferType | null> {
        const transferTypeEntity = await this.repository.findOne({
            where: { id }
        });
        if (!transferTypeEntity) return null;

        const transferType = new TransferType();
        transferType.setId(transferTypeEntity.id);
        transferType.setName(transferTypeEntity.name);

        return transferType;
    }
}