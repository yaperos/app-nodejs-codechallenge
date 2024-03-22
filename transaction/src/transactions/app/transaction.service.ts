import {BadRequestException ,Inject,Injectable, InternalServerErrorException, OnModuleInit } from "@nestjs/common";
import { TransactionRepository } from '../infra/repository/transactions.repository';
import { TransactionEntity } from "../domain/entities/transaction.entity";
import { ConfigService } from "@nestjs/config";
import { ClientKafka } from "@nestjs/microservices";


@Injectable()
export class TransactionService implements OnModuleInit {

    constructor(
        private readonly configService: ConfigService,
        private readonly transactionRepository: TransactionRepository,
        @Inject('TRANSACTION_SERVICE') private readonly clientKafka: ClientKafka

    ){
    }
    async onModuleInit() {

        await this.clientKafka.connect();
        this.clientKafka.subscribeToResponseOf('transactions.reply');

    }

    async create(transaction: any): Promise<TransactionEntity>{

        const toSave = new TransactionEntity();

        if (transaction.accountExternalIdDebit===0) {
            toSave.accountExternalId = transaction.accountExternalIdCredit;
            toSave.typeAccount = 2;
        }else{
            toSave.accountExternalId = transaction.accountExternalIdDebit;
            toSave.typeAccount = 1;
        }

        toSave.status = 'PENDING';
        toSave.transferTypeId = transaction.transferTypeId
        toSave.value = transaction.value;
        
        try {
            const response = await this.transactionRepository.save(toSave).catch((error)=>{
                throw new InternalServerErrorException({
                    message: 'Ocurrio un fallo en el almacenamiento de la transaccion',
                    detail: error
                });
            });


            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                'Ocurrio un fallo en el almacenamiento de la transaccion',
              );
        }
    }

    async findByTransactionalExternalId(id: number){
        
        if (!id)
        { throw new BadRequestException('El parametro id es requerido');}

        const transaction = await this.transactionRepository.findByTransactionalExternalId(id);

        if(!transaction)
        {throw new BadRequestException('Transaccion no encontrada')}
        //Logger.log(JSON.stringify(transaction));
        const response = {
            transactionExternalId: transaction.id,
            transactionType:{
                type: transaction.transferTypeId
            },
            transactionStatus:{
                status: transaction.status
            },
            value: transaction.value,
            createdAt: transaction.createdAt
        }
        
        return response;
    }
    async findTransactionById(id: number){
        if (!id)
        { throw new BadRequestException('El parametro id es requerido');}

        const transaction = await this.transactionRepository.findByTransactionalExternalId(id);

        if(!transaction)
        {throw new BadRequestException('Transaccion no encontrada')}

        return transaction;
    }

    async sendTransaction(data:any){

        this.clientKafka.emit('transactions', JSON.stringify(data)).toPromise();

    }
    async updateTransaction(id:number, status:string){

        if (!id)
        { throw new BadRequestException('El parametro id es requerido');} 

        if(status==="")
        {throw new BadRequestException('El parametro status es requerido');}

        const transaction = await this.transactionRepository.findByTransactionalExternalId(id);

        if(!transaction){
            throw new BadRequestException('Transaccion no encontrada')
        }
        
        return await this.transactionRepository.update({id}, {status}).catch((error)=>{
            throw new InternalServerErrorException({
                message: 'Ocurrio un fallo en la actualizacion de la transaccion',
                detail: error
            });
        });
    }

}