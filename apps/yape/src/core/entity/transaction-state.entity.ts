import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({ name: 'transaction_states' })
export class TransactionStateEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  static parseToEntity(data: any): TransactionStateEntity {
    let entity = new TransactionStateEntity();
    entity.id = data?.id;
    entity.name = data?.name;
    entity.description = data?.description;
    return entity;
  }

}