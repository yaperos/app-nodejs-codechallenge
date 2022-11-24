import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:TransactionTypeEntity.TABLE_NAME })
export class TransactionTypeEntity {

  private static TABLE_NAME  : string = 'transaction_type';


  @PrimaryGeneratedColumn("increment", { name: "id_type" })
  id: number;

  @Column({ name: 'name', length: 200, nullable: false })
  name: string;

}