import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthsService } from './auths.service';
import { AuthType } from './dto/auth-user.dto';
import { AuthInput } from './inputs/auth.input';
import { GraphQLError } from 'graphql';

@Resolver()
export class AuthsResolver {
  constructor(private authsService: AuthsService) {}

  @Mutation(() => AuthType)
  async authenticateUser(@Args('input') input: AuthInput) {
    const validate = await this.authsService.validate(input);
    if (validate) {
      return await this.authsService.login(validate);
    } else {
      throw new GraphQLError('Authentication failed, invalid credentials!');
    }
  }
}
