import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
