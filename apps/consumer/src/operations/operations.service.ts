import { Injectable, Logger } from "@nestjs/common";
import TransactionInDto from "./dto/transaction.in.dto";

@Injectable()
export default class OperationsService {
  public processTransactions = async (dto: TransactionInDto) => {
    Logger.log(dto, OperationsService.name);
    const { id, value } = dto;

    if (value >= 1000) {
      Logger.error("Is fraud");
    } else {
      Logger.log("It's ok");
    }
  };
}
