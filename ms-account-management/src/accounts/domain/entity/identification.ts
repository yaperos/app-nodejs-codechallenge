export enum DocumentType {
  DNI = 'DNI',
  PASAPORTE = 'PASAPORTE',
  CARNET_EXT = 'CARNET_EXT',
}

export interface Identification {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
}
