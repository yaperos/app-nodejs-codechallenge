import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import { UserEntity } from './entity/user.entity';

@Resolver()
export class UsersResolver {
  constructor(private readonly _usersService: UsersService) {}

  @Query(() => [UserDTO])
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<UserEntity[]> {
    return this._usersService.findAll();
  }
}
