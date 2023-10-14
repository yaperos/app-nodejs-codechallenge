import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UpdateAccountRequestDto as IUpdateAccountRequestDto } from 'src/accounts/domain/dto/update-account-request.dto';
import { AccountStatus } from 'src/accounts/domain/entity/account';
import { DocumentType } from 'src/accounts/domain/entity/identification';

export class UpdateAccountRequestDto implements IUpdateAccountRequestDto {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsNumberString()
  phone: string;

  @IsOptional()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsOptional()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(10)
  documentNumber: string;

  @IsOptional()
  @IsEnum(AccountStatus)
  status: AccountStatus;
}
