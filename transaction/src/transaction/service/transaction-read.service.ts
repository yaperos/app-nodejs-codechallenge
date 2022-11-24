import { Inject, Injectable, Logger } from "@nestjs/common";
import { TransactionReadEntity } from "../entity/transaction-read.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TransactionRsDto } from "../dto/transaction-rs.dto/transaction-rs.dto";
import { TransactionMapper } from "../mapper/transaction.mapper";
import { AntiFraudResponseDto } from "../dto/anti-fraud-response.dto";

@Injectable()
export class TransactionReadService {

  private readonly logger = new Logger(TransactionReadService.name);

  constructor(
    @InjectModel(TransactionReadEntity.name)
    private readonly model: Model<TransactionReadEntity>,
    @Inject(TransactionMapper)
    private readonly _transactionMapper: TransactionMapper
  ) {
  }

  async findOne(id: string) {
    let response = await this.model.findOne({
      transactionExternalId: id
    }).exec();
    return this._transactionMapper.mapTransactionReadToResponse(response);
  }

  async findAll() {
    let response = await this.model.find({}).exec();
    let result = response.map(x => {
      return this._transactionMapper.mapTransactionReadToResponse(x)
    });
    return result;
  }

  async insert(transaction: TransactionRsDto) {
    this.logger.log("TransactionReadService.insert :::: SAVE TRANSACTION IN READ DATABASE ");
    let transactionReadEntity = this._transactionMapper.mapTransactionResponseToRead(transaction);
    return new this.model({
      ...transactionReadEntity
    }).save();
  }

  updateStatus(response: AntiFraudResponseDto){
    this.logger.log("TransactionReadService.updateStatus :::: Update Status transaction");
    this.model.findOneAndUpdate(
      {transactionExternalId: response.transactionExternalId},
      {$set: {
        transactionStatus: response.status
        }}
    ).then(()=>{
      this.logger.log("TransactionReadService.updateStatus :::: UPDATE STATUS SUCESS IN READ DATABASE ");
    });
  }


}
