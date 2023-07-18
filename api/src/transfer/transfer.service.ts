import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { Repository } from 'typeorm';
import { TransferStatus } from './entities/transfer-status.entity';
import { TransferType } from './entities/transfer-type.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private transferRepository: Repository<Transfer>,
    @InjectRepository(TransferStatus)
    private transferStatusRepository: Repository<TransferStatus>,
    @InjectRepository(TransferType)
    private transferTypeRepository: Repository<TransferType>,
  ) {}


  async create(createTransferDto: CreateTransferDto) {
    const status = await this.transferStatusRepository.findOne(
      { 
        where: {id:1}, 
      }
    );
    const type = await this.transferTypeRepository.findOne(
      { 
        where: {id:createTransferDto.tranferTypeId}, 
      }
    );
    const transfer = {
      transactionExternalId:createTransferDto.accountExternalIdDebit ?? createTransferDto.accountExternalIdCredit,
      transactionType: type,
      transactionStatus: status,
      value: createTransferDto.value,
    }
    const newuser = this.transferRepository.create(transfer);
    return this.transferRepository.save(newuser);
  }


  async dataAdition() {
    const statusArray = [];
    const typeArray = [];
    for (const status of ['pending', 'approved', 'rejected']) {
      const newStatus = this.transferStatusRepository.create({name:status});
      statusArray.push(await this.transferStatusRepository.save(newStatus));      
    }

    for (const type of ['internal', 'external']) {
      const newType = this.transferTypeRepository.create({name:type});
      typeArray.push(await this.transferTypeRepository.save(newType));
    }

    return {status:statusArray, type:typeArray}

  }

  findAll() {
    return this.transferRepository.find();
  }

  findOne(id: number) {
    return this.transferRepository.findOne(
        { 
          where: { id }, 
          select: {
            transactionType: {
              name: true
            },
            transactionStatus: {
              name: true
            },

          },
          relations: [
            'transactionType',
            'transactionStatus'
          ]
        }
      );
  }

  async update(id: number, updateTransferDto: UpdateTransferDto) {
    const transfer = await this.findOne(id);
    const status = await this.transferStatusRepository.findOne(
      { 
        where: {id:updateTransferDto.status}, 
      }
    );
    transfer.transactionStatus= status;
    return this.transferRepository.save(transfer);
  }

  remove(id: number) {
    return `This action removes a #${id} transfer`;
  }
}
