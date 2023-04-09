import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BasicNameDto {
  @Expose()
  readonly name: string;
}
