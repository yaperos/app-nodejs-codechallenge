import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TxEntity} from "@yape/yape-domain/entity/tx.entity";
import {Repository} from "typeorm";
import {ClientKafka} from "@nestjs/microservices";
import {TxCreateDto} from "@yape/yape-domain/dto/tx.create.dto";
import {UserEntity} from "@yape/yape-domain/entity/user.entity";

@Injectable()
export class YapeTransactionService {
    @InjectRepository(TxEntity)
    private readonly repository: Repository<TxEntity>

    constructor(
        @Inject('YAPE_AF_MICROSERVICE')
        private readonly afClient: ClientKafka,
    ) {
    }

    async create(tx: TxCreateDto): Promise<string> {
        const txEntity = this.repository.create();
        txEntity.userCredit = new UserEntity(tx.accountExternalIdCredit);
        txEntity.userDebit = new UserEntity(tx.accountExternalIdDebit);
        txEntity.status = 1;
        txEntity.type = tx.transferTypeId;
        txEntity.createdAt = new Date();
        txEntity.value = tx.value;

        await this.repository.save(txEntity);

        console.log('before emit yape.af.validate');
        this.afClient.emit('yape.af.validate', JSON.stringify({
            id: txEntity.id,
            value: txEntity.value
        }));

        return txEntity.id;
    }

    async validate(tx: any) {
        const txEntity = await this.repository.findOne({where: {id: tx.id}});
        txEntity.status = tx.status;

        await this.repository.save(txEntity);
    }

    async retrieve(id: string): Promise<any> {

        const tx = await this.repository.findOne({where: {id},});

        return tx.id;

    }
}
