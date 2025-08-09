import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class BaseResolver {
  @Query(() => String, { name: 'ping' })
  ping(): string {
    return 'pong';
  }

  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL';
  }
}
