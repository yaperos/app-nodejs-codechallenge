import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Outbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  aggregatetype: string;

  @Column()
  aggregateid: string;

  @Column()
  eventtype: string;

  @Column()
  eventname: string;

  @Column({
    type: 'jsonb',
  })
  payload: object;

  @CreateDateColumn()
  createdAt: Date;
}
