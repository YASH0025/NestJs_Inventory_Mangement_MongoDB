/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CategoryDocument } from './category.model';
import { InventoryDocument } from './inventory.model';

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: CategoryDocument;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Inventory' })
  inventory: InventoryDocument;

}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
