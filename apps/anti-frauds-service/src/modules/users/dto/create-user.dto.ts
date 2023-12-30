import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
