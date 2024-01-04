/* eslint-disable prettier/prettier */
// src/Models/role.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop({ required: true, unique: true })
  roleName: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
