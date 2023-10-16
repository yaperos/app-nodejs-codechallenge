import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { UserDTO } from 'src/users/dto/user.dto';
import { CardTypeDto } from 'src/card-type/dto/card-type.dto';

@ObjectType()
export class UserCardDto {
  @Field()
  readonly id: string;

  @Field()
  readonly stripePaymentMethodId: string;

  @Field()
  readonly brand: string;

  @Field()
  readonly last4: string;

  @Field()
  readonly funding: string;

  @Field()
  readonly exp_month: string;

  @Field()
  readonly exp_year: string;

  @Field()
  readonly isActive: string;

  @Field(() => UserDTO, { nullable: true })
  readonly user: UserDTO;

  @Field(() => CardTypeDto, { nullable: true })
  readonly cardType: CardTypeDto;

  @Field(() => GraphQLISODateTime)
  readonly createdAt: string;

  @Field(() => GraphQLISODateTime)
  readonly updatedAt: string;
}
