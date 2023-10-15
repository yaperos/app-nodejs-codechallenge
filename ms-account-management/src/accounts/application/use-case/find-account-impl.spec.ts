import { AccountRepository } from 'src/accounts/domain/repository/account-repository';
import { FindAccountImpl } from './find-account-impl';
import { Test } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { AccountDto } from 'src/accounts/domain/dto/account.dto';
import { NotFoundException } from '@nestjs/common';
import { Account, AccountStatus } from 'src/accounts/domain/entity/account';
import { DocumentType } from 'src/accounts/domain/entity/identification';

describe('FindAccountImpl', () => {
  let service: FindAccountImpl;
  let repository: AccountRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindAccountImpl,
        {
          provide: 'ACCOUNT_REPOSITORY',
          useValue: {
            findAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FindAccountImpl>(FindAccountImpl);
    repository = module.get<AccountRepository>('ACCOUNT_REPOSITORY');
  });

  describe('execute', () => {
    it('should find an account', async () => {
      const userId = uuidv4();
      const account: Account = {
        userId,
        email: 'johndoe@example.com',
        phone: '987654321',
        password: 'password',
        identification: {
          firstName: 'John',
          lastName: 'Doe',
          documentType: DocumentType.DNI,
          documentNumber: '12345678',
        },
        status: AccountStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const accountDto = AccountDto.builder()
        .userId(userId)
        .email(account.email)
        .phone(account.phone)
        .firstName(account.identification.firstName)
        .lastName(account.identification.lastName)
        .build();

      (repository.findAccount as jest.Mock).mockResolvedValueOnce(account);

      const result: AccountDto = await service.execute(userId);

      expect(result.userId).toBe(accountDto.userId);
      expect(result.email).toBe(accountDto.email);
      expect(result.phone).toBe(accountDto.phone);
      expect(result.firstName).toBe(accountDto.firstName);
      expect(result.lastName).toBe(accountDto.lastName);
    });

    it('should throw an error if account does not exist', async () => {
      const userId = uuidv4();

      (repository.findAccount as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.execute(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
