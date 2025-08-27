import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/entities';
import { USER_SEED } from 'src/infrastructure/seed';

@Injectable()
export class UserSeeder implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async onModuleInit() {
        const exists = await this.userRepo.findOne({ where: { email: USER_SEED.email } });
        if (!exists) {
            await this.userRepo.save(USER_SEED);
            console.log('Usuario por defecto creado');
        }
    }
}