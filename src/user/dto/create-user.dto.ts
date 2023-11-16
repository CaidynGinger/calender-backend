import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstName: string;
}
