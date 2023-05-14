import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repositoryUser: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const password = await bcrypt.hash(createUserInput.password, 10);
    const newUser = this.repositoryUser.create({
      ...createUserInput,
      password,
    });

    return this.repositoryUser.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.repositoryUser.find();
  }

  findOne(username: string): Promise<User> {
    return this.repositoryUser.findOne({ where: { username } });
  }
}
