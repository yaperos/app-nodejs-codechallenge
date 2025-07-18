import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Transaction statuses configuration
 */
export class TrxStatusesConfig {
  @IsString()
  @IsNotEmpty()
  pending!: string;

  @IsString()
  @IsNotEmpty()
  approved!: string;

  @IsString()
  @IsNotEmpty()
  rejected!: string;
}

/**
 * Application properties configuration
 */
export class ApplicationConfig {
  @ValidateNested()
  @Type(() => Object)
  trxTypes!: Record<string, string>;

  @ValidateNested()
  @Type(() => TrxStatusesConfig)
  trxStatuses!: TrxStatusesConfig;
}

/**
 * Complete application configuration
 */
export class AppConfig {
  @ValidateNested()
  @Type(() => ApplicationConfig)
  application!: ApplicationConfig;
}
