import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { StatusTransaction } from 'src/common/constants/statusTransaction.constant';
import { UserDTO } from 'src/users/dto/user.dto';
import { UserCardDto } from 'src/user-cars/dto/user-card.dto';

@ObjectType()
export class GetTransactionDto {
  @Field()
  readonly id: string;

  @Field()
  readonly amount: number;

  @Field()
  readonly status: StatusTransaction;

  @Field(() => UserDTO, { nullable: true })
  readonly user: UserDTO;

  @Field(() => UserCardDto, { nullable: true })
  readonly userCard: UserCardDto;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: string;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: string;
}
