/* eslint-disable prettier/prettier */
// user.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  number: number;
  @Prop()
  stripeCustomerId: string;

  @Prop({
    type: {
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    required: true,
  })
  address: {
    city: string;
    state: string;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  roleId: MongooseSchema.Types.ObjectId;

  @Prop() // Add this line to include resetToken field
  resetToken: string; 
}

export const UserSchema = SchemaFactory.createForClass(User);
export interface UserDocument extends User, Document {}

// rest of the code...
