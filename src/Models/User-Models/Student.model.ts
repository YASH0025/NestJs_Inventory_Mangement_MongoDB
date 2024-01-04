import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop({ required: true })
  student_id: number;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: {
      math: { type: Number, required: true },
      science: { type: Number, required: true },
      history: { type: Number, required: true },
    },
  })
  marks: {
    math: number;
    science: number;
    history: number;
  };

  @Prop({ required: true })
  grade: string;

  @Prop({
    required: true,
    type: {
      total_classes: { type: Number, required: true },
      attended_classes: { type: Number, required: true },
    },
  })
  attendance: {
    total_classes: number;
    attended_classes: number;
  };
}

export const StudentSchema = SchemaFactory.createForClass(Student);