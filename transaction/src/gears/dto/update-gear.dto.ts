import { PartialType } from '@nestjs/mapped-types';
import { CreateGearDto } from './create-gear.dto';

export class UpdateGearDto extends PartialType(CreateGearDto) {
  id: number;
}
