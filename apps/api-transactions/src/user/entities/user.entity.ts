import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'User id' })
  id: number;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  password: string;
}
