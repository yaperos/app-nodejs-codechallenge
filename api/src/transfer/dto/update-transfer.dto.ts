import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferDto } from './create-transfer.dto';

import { IsNotEmpty } from 'class-validator';

export class UpdateTransferDto extends PartialType(CreateTransferDto) {
    @IsNotEmpty()
    id: number;
}
