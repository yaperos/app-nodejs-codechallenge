/* eslint-disable no-unused-vars */
import {
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({
    type: 'timestamp',
    default: () => {
    return 'CURRENT_TIMESTAMP(6)';
    },
    })
    createdAt!: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => {
    return 'CURRENT_TIMESTAMP(6)';
    },
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt?: Date;
}
