import { IsNumber, IsUUID, Min } from 'class-validator';

export class AntifraudRequestDto {
  @IsUUID()
  transactionId: string;

  @IsNumber()
  @Min(1, { message: 'Value must be a number greater than 0' })
  value: number;
}
