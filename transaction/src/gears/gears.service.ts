import { Injectable } from '@nestjs/common';
import { CreateGearDto } from './dto/create-gear.dto';
import { UpdateGearDto } from './dto/update-gear.dto';

@Injectable()
export class GearsService {
  create(createGearDto: CreateGearDto) {
    return 'This action adds a new gear';
  }

  findAll() {
    return `This action returns all gears`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gear`;
  }

  update(id: number, updateGearDto: UpdateGearDto) {
    return `This action updates a #${id} gear`;
  }

  remove(id: number) {
    return `This action removes a #${id} gear`;
  }
}
