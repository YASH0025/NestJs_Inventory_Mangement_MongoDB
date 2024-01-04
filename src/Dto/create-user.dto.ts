/* eslint-disable prettier/prettier */
// create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  IsObject,
} from 'class-validator';

class AddressDto {
  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsObject()
  @IsNotEmpty()
  address: AddressDto;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}
