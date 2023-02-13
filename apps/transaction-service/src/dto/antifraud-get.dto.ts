import { IsArray, IsBoolean, IsNumber, IsString, } from 'class-validator';
import {
  Expose,
  Type,
} from 'class-transformer';

export class AntifraudFeatures {
    @IsString()
    readonly code: string;
  
    @IsString()
    readonly description: string;
  
    @IsNumber()
    readonly statusId: number;
  
    @IsBoolean()
    readonly active: boolean;
}
  
export class AntifraudReq  {

  @IsArray()
  features: AntifraudFeatures[]
  
  @IsNumber()
  transactionId: number;
}

export class AntifraudFeaturesDTO  {
  @Expose()
  value: AntifraudReq;
}