export class MasterTable {
  id: number;

  parentId?: number;
  name: string;
  description?: string;
  value?: string;

  createdAt: Date;
  updatedAt?: Date;
}
