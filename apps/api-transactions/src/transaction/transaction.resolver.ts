import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TransactionResolver {
  @Query(() => String)
  helloWorld(): string {
    return 'hola mundo';
  }

  @Query(() => String)
  getTransaction(): string {
    return 'aqui una transaction';
  }
}
