

import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class RequestTransactionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(36)
  @MaxLength(36)
  @ApiProperty()
  @Field()
  transactionExternalId: string;
}