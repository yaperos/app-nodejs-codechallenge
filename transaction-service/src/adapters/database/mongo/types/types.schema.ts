import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TypesDocument = Types & Document;

@Schema({ timestamps: true })
export class Types {
  @Prop({
    index: true,
    unique: true,
  })
  id: string;

  @Prop()
  name: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TypesSchema = SchemaFactory.createForClass(Types);
