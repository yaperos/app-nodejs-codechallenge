import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { FilterProps } from 'src/modules/shared/domain/criteria/filter';
import { FilterField } from 'src/modules/shared/domain/criteria/filter-field';
import { Operator } from 'src/modules/shared/domain/criteria/filter-operator';
import { OrderBy } from 'src/modules/shared/domain/criteria/order-by';
import { OrderTypeEnum } from 'src/modules/shared/domain/criteria/order-type';

class FilterDto implements FilterProps {
  @IsString()
  @MinLength(FilterField.MIN_LENGTH)
  field: string;

  @IsEnum(Operator)
  operator: string;

  @IsString()
  value: string;
}

export abstract class PaginatedBaseRequestDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters?: Array<FilterDto>;

  @IsOptional()
  @IsString()
  @MinLength(OrderBy.MIN_LENGTH)
  @Matches(OrderBy.VALID_REGEX, {
    message: 'Param orderBy is invalid',
  })
  orderBy?: string;

  @IsOptional()
  @IsEnum(OrderTypeEnum)
  order?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
