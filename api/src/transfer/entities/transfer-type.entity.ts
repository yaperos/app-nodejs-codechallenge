import { Entity, PrimaryGeneratedColumn, Column  } from "typeorm";

@Entity()
export class TransferType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}


