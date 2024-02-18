import KafkaProducer from '../commons/utils/KafkaProducer'
import TransactionDTO from '../domain/models/TransactionDTO'
import  Transaction  from '../domain/models/db/TransactionModel'
import { TransactionType } from '../domain/models/db/TransactionType'
import { TransactionStatus } from '../domain/models/db/TransactionStatus'
import TransactionRepository from '../domain/repository/TransactionRepository'
import { v4 } from 'uuid'
import TransactionTypeService from './TransactionTypeService'
import TransactionStatusService from './TransactionStatusService'
import TransactionMessageDTO from '../domain/models/TransactionMessageDTO'
import TransactionModel from '../domain/models/db/TransactionModel'
import { DefaultValues } from '../domain/constants/TransactionConstants'
import { KafkaConstants } from '../domain/constants/Kafka'

export default class TransactionService {
    private kafkaProducer = new KafkaProducer();
    transactionRepository: TransactionRepository;
    transactionTypeService: TransactionTypeService;
    transactionStatusService: TransactionStatusService;
    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.transactionTypeService = new TransactionTypeService();
        this.transactionStatusService = new TransactionStatusService();
    }

    createTransaction = async (transaction: TransactionDTO) => {
        const transactionModel = this.castDTOModel(transaction);
        try {
            const transactionType = await this.transactionTypeService.findTransaction(new TransactionType({name:DefaultValues.DEFAULT_TYPE}));
            const transactionStatus = await this.transactionStatusService.findTransaction(new TransactionStatus({name:DefaultValues.DEFAULT_STATUS}));
            transactionModel.transactionTypeID = transactionType.id;
            transactionModel.transactionStatusID = transactionStatus.id;
            const createdTransaction = await this.transactionRepository.createTransaction(transactionModel);
            if(createdTransaction != undefined){
            const message = this.createMessage(createdTransaction);
            this.sendCreatedMessage(message);    
            return createdTransaction;
            }
            console.error(`TransactionService: transaction not created`);

        } catch (err) {
            console.error(err)
        }
    }

    updateTransactionStatusfromMessage = async(transactionMessage: TransactionMessageDTO) =>{
        try{
            await TransactionModel.update({transactionStatusID:transactionMessage.transactionStatusId},
                {where:{transactionExternalId:transactionMessage.transactionExternalId}});

        }catch(err){
            throw(err)
        }
    }

    private castDTOModel = (transactionPromp: TransactionDTO): Transaction => {
        const transaction = new Transaction({
            accountExternalIdDebit: transactionPromp.accountExternalIdDebit,
            accountExternalIdCredit: transactionPromp.accountExternalIdCredit,
            tranferTypeId: transactionPromp.tranferTypeId,
            value: transactionPromp.value,
            transactionExternalId: v4(),
            transactionType: new TransactionType({ name: DefaultValues.DEFAULT_TYPE }),
            transactionStatus: new TransactionStatus({ name: DefaultValues.DEFAULT_STATUS}),

        });
        return transaction;
    }

    private sendCreatedMessage = (transactionMessageDTO:TransactionMessageDTO)=>{
        this.kafkaProducer.sendMessage(KafkaConstants.TRANSACTION_PENDGING_TOPIC,[{value:JSON.stringify(transactionMessageDTO)}]);
        return true;
    }

    private createMessage = (transaction:TransactionModel)=>{
        const transactionMessageDTO = new TransactionMessageDTO(
            transaction.transactionExternalId,
            transaction.transactionStatusID,
            transaction.value
        )
        return transactionMessageDTO;
    }


}