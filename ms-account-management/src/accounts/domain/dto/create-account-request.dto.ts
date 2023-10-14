import { DocumentType } from '../entity/identification';

export interface CreateAccountRequestDto {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
}
