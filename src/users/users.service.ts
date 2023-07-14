import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users, 'CreateUserDto')
    private usersRepository: Repository<Users>
  ) {}
  createUsers(Users) {
    const newUsers = this.usersRepository.create(Users);
    return this.usersRepository.save(newUsers);
  }

  getUsers() {
    return this.usersRepository.find();
  }
}
