import { Injectable } from '@nestjs/common';
import { InjectRepository,} from '@nestjs/typeorm';
import { CreateTranferTypeInput } from './dto/create-tranfer-type.input';
import { UpdateTranferTypeInput } from './dto/update-tranfer-type.input';
import {TranferType} from 'src/tranfer-type/entities/tranfer-type.entity';
import { Repository,} from 'typeorm';

@Injectable()
export class TranferTypeService {

   constructor(
    @InjectRepository(TranferType) private tranferTypeRepository:Repository<TranferType>
    ){}

  create(createTranferTypeInput: CreateTranferTypeInput) {
    const tranferType = this.tranferTypeRepository.create(createTranferTypeInput);
    return this.tranferTypeRepository.save(tranferType);
  }

  findAll():Promise<TranferType[]> {
    return this.tranferTypeRepository.find();
  }

  findOneById(id: number):Promise<TranferType>{
    return this.tranferTypeRepository.findOne({
      where:{
        id,
      }
    });
  }
}
