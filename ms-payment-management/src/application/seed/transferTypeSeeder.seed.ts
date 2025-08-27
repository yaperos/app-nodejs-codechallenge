import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferType } from 'src/domain/entities/transferType.entity';

@Injectable()
export class TransferTypeSeeder implements OnModuleInit {
    constructor(
        @InjectRepository(TransferType)
        private readonly transferTypeRepo: Repository<TransferType>,
    ) { }

    async onModuleInit() {
        const types = [
            { name: 'transfer' },
            { name: 'deposit' },
        ];
        for (const type of types) {
            const exists = await this.transferTypeRepo.findOne({ where: { name: type.name } });
            if (!exists) {
                await this.transferTypeRepo.save(type);
                console.log(`TransferType '${type.name}' creado`);
            }
        }
    }
}
