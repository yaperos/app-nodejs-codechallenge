import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('transfer-type')
export class TransferType {
  @PrimaryColumn()
  transferTypeId: number;

  @Column()
  name: string;
}
