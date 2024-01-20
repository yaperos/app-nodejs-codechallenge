import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('TransferType')
export class TransferType {
  @PrimaryGeneratedColumn()
  transferTypeId: number;

  @Column({ unique: true })
  name: string;
}
