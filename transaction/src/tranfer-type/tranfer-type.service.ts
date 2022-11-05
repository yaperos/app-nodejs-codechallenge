import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTranferTypeDto } from './dto/create-tranfer-type.dto';
import { UpdateTranferTypeDto } from './dto/update-tranfer-type.dto';
import { TranferType } from './entities/tranfer-type.entity';

@Injectable()
export class TranferTypeService {
  constructor(
    @InjectRepository(TranferType)
    private repository: Repository<TranferType>,
  ) {}

  create(createTranferTypeDto: CreateTranferTypeDto) {
    const row = this.repository.create(createTranferTypeDto);
    return this.repository.save(row);
  }

  findAll() {
    return this.repository.find({ order: { name: 'ASC' } });
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, updateTranferTypeDto: UpdateTranferTypeDto) {
    const row = await this.repository.preload({
      id: id,
      ...updateTranferTypeDto,
    });
    if (!row) {
      throw new NotFoundException(`Row ${id} not found`);
    }
    return this.repository.save(row);
  }

  remove(id: number) {
    return this.repository.softDelete(id);
  }
}
