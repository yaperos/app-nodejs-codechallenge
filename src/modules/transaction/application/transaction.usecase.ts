import { CustomError } from "../../../helpers/domain/entities/custom-error";
import { HttpCode } from "../../../helpers/domain/enums/http-code.enum";
import { NotificationTopic } from "../../../helpers/domain/enums/notification-topic.enum";
import { CreateTransactionRequestDto } from "../domain/interfaces/dtos/transaction-request.dto";
import { ITransactionCreationMapper } from "../domain/interfaces/mappers/transaction-creation.mapper.interface";
import { ITransactionInfoMapper } from "../domain/interfaces/mappers/transaction-info.mapper.interface";
import { INotificationRepository } from "../domain/interfaces/repositories/notification.repository.interface";
import { ITransactionRepository } from "../domain/interfaces/repositories/transaction.repository.interface";
import { ITransferTypeRepository } from "../domain/interfaces/repositories/transfer-type.repository.interface";

export class TransactionUsecase {

    constructor(
        private readonly transactionRepository: ITransactionRepository,
        private readonly transferTypeRepository: ITransferTypeRepository,
        private readonly notificationRepository: INotificationRepository,
        private readonly transactionCreationMapper: ITransactionCreationMapper,
        private readonly transactionInfoMapper: ITransactionInfoMapper,
    ) {}

    public async createTransaction(data: CreateTransactionRequestDto): Promise<void> {
        const transferType = await this.transferTypeRepository.findOneById(data.transferTypeId);
        if (!transferType) {
            throw new CustomError({ httpCode: HttpCode.NOT_FOUND, message: "The transfer type not found" });
        }

        const transaction = this.transactionCreationMapper.transform(data, transferType);
        const createdTransaction = await this.transactionRepository.save(transaction);
        const transactionInfo = this.transactionInfoMapper.transform(createdTransaction);
        await this.notificationRepository.sendMessage(NotificationTopic.WHEN_IT_IS_CREATED_AN_TRANSACTION, transactionInfo);
    }


}