import { Resolver, Query } from "@nestjs/graphql";

@Resolver()
export class AppResolver {
  @Query(returns => String)
  hello(): string {
    return '¡Hola, mundo!';
  }
}