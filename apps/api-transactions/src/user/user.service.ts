import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repositoryUser: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput): Promise<User> {
    const newUser = this.repositoryUser.create(createUserInput);
    return this.repositoryUser.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.repositoryUser.find();
  }

  findOne(id: number): Promise<User> {
    return this.repositoryUser.findOne({ where: { id } });
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    // user = this.findOne(id);
    // this
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    // return this.repositoryUser.delete({})
  }
}
