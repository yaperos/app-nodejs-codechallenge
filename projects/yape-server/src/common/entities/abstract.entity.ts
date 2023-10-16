import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsString } from 'class-validator';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  @IsDate()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false, nullable: true })
  @IsDate()
  deletedAt?: Date;
}
