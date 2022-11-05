import { PartialType } from '@nestjs/mapped-types';
import { CreateTranferTypeDto } from './create-tranfer-type.dto';

export class UpdateTranferTypeDto extends PartialType(CreateTranferTypeDto) {}
