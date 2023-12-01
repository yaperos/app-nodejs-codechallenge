import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDefined, IsNumber} from 'class-validator'
import { Expose } from 'class-transformer'

@InputType()
export class CreateTransferInput {
    @Field()
    @Expose()
    @IsDefined()
    name: string
}

@InputType()
export class SearchTransfersQuery {
    @Field(type => [Int], { nullable: true })
    @IsNumber({},{ each: true})
    ids?: number[]

    @Field(type => [String], { nullable: true, name: 'names' })
    @Expose({ name: 'names' })
    names?: string[]

}