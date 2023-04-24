import { Expose } from 'class-transformer';
import { IsDefined, IsIn } from 'class-validator';

export class HeadersDto {

  @IsDefined()
  @IsIn(['YAPE'])
  @Expose({ name: 'x-commerce' })
  'commerce': string;

  @IsDefined()
  @IsIn(['BCP'])
  @Expose({ name: 'x-channel' })
  'channel': string;

  'eventId'?: string;
  'eventType'?: string;
  'entityId'?: string;
  'entityType'?: string;
  'timestamp'?: string;
  'datetime'?: string;

}
