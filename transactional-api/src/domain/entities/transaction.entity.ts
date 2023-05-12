import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ObjectType, Field } from '@nestjs/graphql'

@Entity({ name: 'Transaction' })
@ObjectType()
export class Transaction extends BaseEntity {
    @Field()
    @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
    transactionExternalId: string;

    @Field({nullable: true})
    @Column({ type: 'uuid', nullable: true })
    accountExternalIdDebit: string;

    @Field({nullable: true})
    @Column({ type: 'uuid', nullable: true })
    accountExternalIdCredit: string;

    @Field()
    @Column('int')
    transferTypeId: number;

    @Field()
    @Column('float')
    value: number;

    @Field()
    @Column('int')
    transactionStatus: number;

    @Field()
    @Column('int')
    transactionType: number
}