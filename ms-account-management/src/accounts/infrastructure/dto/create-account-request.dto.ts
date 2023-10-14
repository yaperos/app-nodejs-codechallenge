import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateAccountRequestDto as ICreateAccountRequestDto } from 'src/accounts/domain/dto/create-account-request.dto';
import { DocumentType } from 'src/accounts/domain/entity/identification';

export class CreateAccountRequestDto implements ICreateAccountRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(10)
  documentNumber: string;
}
