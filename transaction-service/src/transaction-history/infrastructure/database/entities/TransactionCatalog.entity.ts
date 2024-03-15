import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CatalogTypes } from '../../../domain/enums/CatalogTypes';

@Entity({ name: 'transaction_catalog' })
export class TransactionCatalogEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CatalogTypes,
  })
  type: CatalogTypes;
}
