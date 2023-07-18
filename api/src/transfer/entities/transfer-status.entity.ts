import { Entity, PrimaryGeneratedColumn, Column  } from "typeorm";

@Entity()
export class TransferStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}


