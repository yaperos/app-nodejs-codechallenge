import { AccountRepository } from 'src/accounts/domain/repository/account-repository';
import { CreateAccountImpl } from './create-account-impl';
import { CreateAccountRequestDto } from 'src/accounts/infrastructure/dto/create-account-request.dto';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentType } from 'src/accounts/domain/entity/identification';
import { v4 as uuidv4 } from 'uuid';
import { Account, AccountStatus } from 'src/accounts/domain/entity/account';
import { PasswordEncoder } from 'src/common/util/password-encoder';

describe('CreateAccountImpl', () => {
  let service: CreateAccountImpl;
  let repository: AccountRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateAccountImpl,
        {
          provide: 'ACCOUNT_REPOSITORY',
          useValue: {
            createAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateAccountImpl>(CreateAccountImpl);
    repository = module.get<AccountRepository>('ACCOUNT_REPOSITORY');
  });

  describe('execute', () => {
    it('should create an account', async () => {
      const dto: CreateAccountRequestDto = {
        email: 'johndoe@example.com',
        phone: '987654321',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        documentType: DocumentType.DNI,
        documentNumber: '12345678',
      };

      const account: Account = {
        userId: uuidv4(),
        email: dto.email,
        phone: dto.phone,
        password: PasswordEncoder.encode(dto.password),
        identification: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          documentType: dto.documentType,
          documentNumber: dto.documentNumber,
        },
        status: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (repository.createAccount as jest.Mock).mockResolvedValueOnce(account);

      const result: GenericResponseDto = await service.execute(dto);

      expect(result.message).toBe('Account created successfully');
    });

    it('should throw an error if account creation fails', async () => {
      const dto: CreateAccountRequestDto = {
        email: 'johndoe@example.com',
        phone: '987654321',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        documentType: DocumentType.DNI,
        documentNumber: '12345678',
      };

      (repository.createAccount as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(service.execute(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
