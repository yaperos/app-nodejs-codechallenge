import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export class BaseEntity{
    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date 

    @DeleteDateColumn()
    deletedAt: Date | null;

    @VersionColumn()
    version:number

}