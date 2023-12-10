import { IsOptional, Min } from 'class-validator';

export class PaginationArgs {
  @IsOptional()
  @Min(1)
  first: number = 10;

  @IsOptional()
  @Min(0)
  offset: number = 0;
}
