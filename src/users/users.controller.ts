/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Get } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Get()
  getUsers() {
    return this.UsersService.getUsers();
  }

  @Post()
  createUsers(@Body() newUser: CreateUserDto) {
    return this.UsersService.createUsers(newUser);
  }
}
