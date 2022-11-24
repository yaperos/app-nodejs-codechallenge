import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionTypeRepository } from "../../repository/transaction-type.repository";
import { TransactionTypeEntity } from "../../entity/transaction-type.entity";

@Injectable()
export class TransactionTypeService {

  constructor(
    @InjectRepository(TransactionTypeEntity)
    private readonly _transactionTypeRepository: TransactionTypeRepository
  ) {}

  async findById(idType: number): Promise<TransactionTypeEntity>{
    return await this._transactionTypeRepository.findOne(
      {where: {'id': idType}}
    );
  }

}
