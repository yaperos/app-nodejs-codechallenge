import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { BaseDto } from '../../../@base/base.dto';

export class AccountDto extends BaseDto {
  @ApiProperty()
  @IsString()
  readonly accountExternalId: string;

  @ApiProperty()
  @IsString()
  readonly identifier: string;

  @ApiProperty()
  @IsNumber()
  readonly balance: number;

  constructor(partial: Partial<AccountDto>) {
    super();
    Object.assign(this, partial);
  }
}