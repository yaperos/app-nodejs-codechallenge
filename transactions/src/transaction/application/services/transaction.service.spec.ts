import { UserService } from 'src/transaction/domain/interfaces/user.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceImpl } from './transaction.service';
import { CreateUserDto } from '../dto/transaction.create.dto';
import {
  userCreateDataFake as registerCreateDataFake,
  userDataFake as registerDataFake,
  userUpdateDataFake as registerUpdateDataFake,
} from 'src/test/mock/user.sql.fake';
import { PasswordHelper } from 'src/auth/infrastructure/helpers/PasswordHelper';
import { FilesModule } from 'src/files/infrastructure/files.module';
import { MailModule } from 'src/email/infrastructure/email.module';
import { CoreModule } from 'src/shared/core.module';
import { ConfigModule } from '@nestjs/config';
import { EmailProvider } from 'src/shared/infrastructure/email/email.provider';
import { UserRepositoryImpl } from 'src/transaction/infrastructure/sql/repositories/user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/transaction/infrastructure/sql/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/transaction/domain/interfaces/user.repository.interface';

describe('UsersController', () => {
  let usersService: UserService;
  let usersRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CoreModule,
        ConfigModule,
        EmailProvider,
        FilesModule,
        MailModule,
      ],
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        PasswordHelper,
        {
          provide: 'UserRepository',
          useClass: UserRepositoryImpl,
        },
        {
          provide: 'UserService',
          useClass: UserServiceImpl,
        },
      ],
    }).compile();

    usersRepository = module.get<UserRepository>('UserRepository');
    usersService = module.get<UserService>('UserService');
  });

  describe('createUser', () => {
    it('should return the created user', async () => {
      // Arrange
      const userDto: CreateUserDto = registerCreateDataFake[0];
      const createdUser = { id: 1, ...userDto };
      jest
        .spyOn(usersRepository, 'create')
        .mockResolvedValue({ ...createdUser, password: undefined });

      // Act
      const result = await usersService.create(userDto, false);

      // Assert
      expect(result).toEqual({ ...createdUser, password: undefined });
    });
  });

  describe('getUser', () => {
    it('should return the requested user by ID', async () => {
      // Arrange
      const user = registerDataFake[0];
      jest.spyOn(usersRepository, 'findById').mockResolvedValue(user);

      // Act
      const result = await usersService.findById(user.id);

      // Assert
      expect(result).toEqual(user);
    });
    it('should return paginated', async () => {
      // Arrange
      jest.spyOn(usersRepository, 'findPaginated').mockResolvedValue({
        total: registerDataFake.length,
        data: registerDataFake,
      });

      // Act
      const result = await usersService.findPaginated({
        page: 0,
        count: 10,
        sort: '',
        sortOrder: 1,
        search: '',
      });

      // Assert
      expect(result).toEqual({
        total: registerDataFake.length,
        data: registerDataFake,
      });
    });
  });

  describe('updateUser', () => {
    it('should return the updated user', async () => {
      // Arrange
      const userId = 1;
      const updatedUserDto = registerUpdateDataFake[0];
      const updatedUser = registerDataFake[0];
      jest.spyOn(usersRepository, 'update').mockResolvedValue(updatedUser);

      // Act
      const result = await usersService.update(userId, updatedUserDto);

      // Assert
      expect(result).toEqual(updatedUser);
    });
  });
});
