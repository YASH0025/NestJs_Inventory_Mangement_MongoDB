/* eslint-disable prettier/prettier */
// create-product.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsString()
  readonly categoryId: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;
}
