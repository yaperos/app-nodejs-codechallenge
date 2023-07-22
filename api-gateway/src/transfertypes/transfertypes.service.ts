import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSFERTYPES } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateTransfertypeInput } from './dto/create-transfertype.input';
import { UpdateTransfertypeInput } from './dto/update-transfertype.input';
import { Transfertype } from './entities/transfertype.entity';
@Injectable()
export class TransfertypesService {

  constructor(@InjectRepository(Transfertype) private _transferTypeRepository: Repository<Transfertype>) {
    this.populateTransfers()
  }

  //only used for testing
  async populateTransfers() {
    const totalTransferTypes = await this._transferTypeRepository.count();
    if (totalTransferTypes == 0) {
      TRANSFERTYPES.forEach(async transfertype => {
        const _transfertype = this._transferTypeRepository.create(transfertype);
        const newTranserType = this._transferTypeRepository.save(_transfertype);
      })
    }
  }


  async create(createTransfertypeInput: CreateTransfertypeInput): Promise<Transfertype> {
    const newTransferType = this._transferTypeRepository.create(createTransfertypeInput);
    return this._transferTypeRepository.save(newTransferType)
  }

  async findAll(): Promise<Transfertype[]> {


    return this._transferTypeRepository.find({
      relations: ["transactions"]
    });
  }

  async findOne(id: number): Promise<Transfertype> {
    return this._transferTypeRepository.findOne({
      where: {
        id
      }
    });
  }

  update(id: number, updateTransfertypeInput: UpdateTransfertypeInput) {
    return `This action updates a #${id} transfertype`;
  }

  remove(id: number) {
    return `This action removes a #${id} transfertype`;
  }
}
