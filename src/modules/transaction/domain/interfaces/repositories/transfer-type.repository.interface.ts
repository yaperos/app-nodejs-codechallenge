import { TransferType } from "../../entities/transfer-type.entity";

export interface ITransferTypeRepository {
    findOneById(id: number): Promise<TransferType | null>;
}