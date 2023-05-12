import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransferType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 48, default: 'transfer' })
  name: string;
}
