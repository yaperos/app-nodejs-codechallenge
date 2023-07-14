import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransferTypeEntity } from '../../domain/entities/transfer-type.entity';

@Entity({ name: 'transfer_types' })
export class TransferTypeModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  static fromEntity(entity: TransferTypeEntity): TransferTypeModel {
    const model = new TransferTypeModel();
    model.id = entity.id;
    model.name = entity.name;
    return model;
  }

  toEntity(): TransferTypeEntity {
    return new TransferTypeEntity(this.id, this.name);
  }
}
