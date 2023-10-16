import { Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this._userRepository.createQueryBuilder('user').getMany();
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return await this._userRepository
      .createQueryBuilder('user')
      .select(['user', 'user.password'])
      .where('user.email = :email', { email: username })
      .orWhere('user.username = :username', { username: username })
      .getOne();
  }

  async findOneByID(id: string): Promise<UserEntity> {
    return await this._userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();
  }
}
