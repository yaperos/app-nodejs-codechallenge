import { Expose } from 'class-transformer';
import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
// Header names are not case sensitive.
export class HeadersDto {
  @IsDefined()
  @IsString()
  @Expose()
  'eventId'?: string;

  @IsDefined()
  @IsString()
  @Expose()
  'eventType'?: string;

  @IsDefined()
  @IsString()
  @Expose()
  'entityId'?: string;

  @IsDefined()
  @IsString()
  @Expose()
  'entityType'?: string;

  @IsDefined()
  @IsString()
  @Expose()
  'timestamp'?: string;

  @IsDefined()
  @IsString()
  @Expose()
  'datetime'?: string;

  @IsDefined()
  @IsIn(['YAPE'])
  'commerce': string;

  @IsOptional()
  @IsIn(['BCP'])
  'channel': string;
}
