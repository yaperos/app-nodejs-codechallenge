import { ObjectType, Field } from 'type-graphql';

export interface IStatus {
  id: number;
  name: string;
}

@ObjectType()
export class StatusObjectType implements Partial<IStatus> {
  @Field()
  name!: string;
}
