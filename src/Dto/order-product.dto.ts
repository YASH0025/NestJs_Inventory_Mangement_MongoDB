/* eslint-disable prettier/prettier */
// order.dto.ts
import { IsMongoId, IsNumber, IsPositive } from 'class-validator';

export class OrderProductDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
