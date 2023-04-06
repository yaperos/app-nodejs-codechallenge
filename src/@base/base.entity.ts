import { Prop } from '@nestjs/mongoose';

export abstract class BaseEntity {
  _id: string;
  
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
