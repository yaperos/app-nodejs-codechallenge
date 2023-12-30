import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const userExist = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new BadRequestException('User already exists');
    }

    createUserDto.password = await bcrypt.hash(password, 10);
    const userToCreate = this.usersRepository.create(createUserDto);
    const { password: createdPassword, ...createdUser } =
      await this.usersRepository.save(userToCreate);

    return createdUser;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const userExist = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new BadRequestException('User already exists');
    }

    let userToCreate = {
      ...createUserDto,
      password: await bcrypt.hash(password, 10),
    };

    userToCreate = this.usersRepository.create(userToCreate);
    const { password: createdPassword, ...createdUser } =
      await this.usersRepository.save(userToCreate);

    return createdUser;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`User [${email}] not found`);
    }

    return user;
  }
}
