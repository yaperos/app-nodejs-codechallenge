import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { TransferStatus } from './entities/transfer-status.entity';
import { TransferType } from './entities/transfer-type.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Transfer]),
    TypeOrmModule.forFeature([TransferStatus]),
    TypeOrmModule.forFeature([TransferType]),
  ],
  controllers: [TransferController],
  providers: [TransferService]
})
export class TransferModule {}  
