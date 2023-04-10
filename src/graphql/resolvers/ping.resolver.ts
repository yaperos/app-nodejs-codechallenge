import { Service } from 'typedi';
import { Resolver, Query } from 'type-graphql';

@Service()
@Resolver()
export class PingResolver {
  @Query(() => String)
  async Ping(): Promise<string> {
    return 'pong';
  }
}
