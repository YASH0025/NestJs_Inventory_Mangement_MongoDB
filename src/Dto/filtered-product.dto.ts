/* eslint-disable prettier/prettier */
// filtered-products.dto.ts
import { IsString } from 'class-validator';

export class FilteredProductsDto {
  @IsString()
  categoryId: string;
}
