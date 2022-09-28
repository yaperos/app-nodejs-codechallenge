import { CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn()
  updatedAt: Date = new Date();

  @DeleteDateColumn()
  deletedAt: Date | null = null;
}
