/* eslint-disable prettier/prettier */
// products-filter.dto.ts

import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ProductsFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
