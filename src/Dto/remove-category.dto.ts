/* eslint-disable prettier/prettier */
// remove-products.dto.ts
import { IsString } from 'class-validator';

export class RemoveProductsDto {
  @IsString()
  category: string;
}
