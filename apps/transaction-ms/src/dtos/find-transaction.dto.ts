import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneParams {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
