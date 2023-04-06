import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly identifier: string;
}