import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GearsService } from './gears.service';
import { CreateGearDto } from './dto/create-gear.dto';
import { UpdateGearDto } from './dto/update-gear.dto';

@Controller()
export class GearsController {
  constructor(private readonly gearsService: GearsService) {}

  @MessagePattern('createGear')
  create(@Payload() createGearDto: CreateGearDto) {
    return this.gearsService.create(createGearDto);
  }

  @MessagePattern('findAllGears')
  findAll() {
    return this.gearsService.findAll();
  }

  @MessagePattern('findOneGear')
  findOne(@Payload() id: number) {
    return this.gearsService.findOne(id);
  }

  @MessagePattern('updateGear')
  update(@Payload() updateGearDto: UpdateGearDto) {
    return this.gearsService.update(updateGearDto.id, updateGearDto);
  }

  @MessagePattern('removeGear')
  remove(@Payload() id: number) {
    return this.gearsService.remove(id);
  }
}
