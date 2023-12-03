import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Injectable()
export class TransactionService {
    constructor(
        @Inject('ANTIFRAUD') private readonly antifraud: ClientKafka,
        @InjectRepository(TransactionEntity)
        private trRep: Repository<TransactionEntity>,
    ) { }

    async save(transaction: TransactionEntity) {
        return this.trRep.save(transaction);
    }

    async validate(id: string, value: number) {
        this.antifraud.emit('antifraud.validate', JSON.stringify({ id, value }));
    }

    async confirmed(id: string, status: string) {
        return this.trRep.update(id, { status });
    }

    async get(id: string) {
        const tr = await this.trRep.findOneBy({ id });

        return {
            value: tr.value,
            transactionExternalId: tr.id,
            transactionType: { name: tr.transferTypeId.toString() },
            transactionStatus: { name: tr.status },
            createdAt: tr.createdAt,
        }
    }
}
