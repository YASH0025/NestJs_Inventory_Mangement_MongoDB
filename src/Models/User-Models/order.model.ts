/* eslint-disable prettier/prettier */
// order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  productId: string;

  @Prop({ type: Number, required: true })
  quantity: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
