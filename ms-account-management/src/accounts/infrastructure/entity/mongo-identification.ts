import { Prop } from '@nestjs/mongoose';
import {
  DocumentType,
  Identification,
} from 'src/accounts/domain/entity/identification';

export class MongoIdentification implements Identification {
  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String })
  documentType: DocumentType;

  @Prop({ required: true, unique: true, type: String })
  documentNumber: string;
}
