import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Exclude, Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class BaseDto {
  @ApiProperty()
  @Transform((value) => value.obj._id.toString())
  readonly _id: ObjectId;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;
}