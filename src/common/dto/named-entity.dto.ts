import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NamedEntityDTO {
  @Field()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
