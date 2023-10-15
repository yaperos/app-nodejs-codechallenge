import { AccountRepository } from 'src/accounts/domain/repository/account-repository';
import { UpdateAccountImpl } from './update-account-impl';
import { Test } from '@nestjs/testing';
import { UpdateAccountRequestDto } from 'src/accounts/infrastructure/dto/update-account-request.dto';
import { DocumentType } from 'src/accounts/domain/entity/identification';
import { Account, AccountStatus } from 'src/accounts/domain/entity/account';
import { v4 as uuidv4 } from 'uuid';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('UpdateAccountImpl', () => {
  let service: UpdateAccountImpl;
  let repository: AccountRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateAccountImpl,
        {
          provide: 'ACCOUNT_REPOSITORY',
          useValue: {
            updateAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateAccountImpl>(UpdateAccountImpl);
    repository = module.get<AccountRepository>('ACCOUNT_REPOSITORY');
  });

  describe('execute', () => {
    it('should update an account', async () => {
      const userId = uuidv4();

      const dto: UpdateAccountRequestDto = {
        firstName: 'John F.',
        lastName: 'Doe',
        status: AccountStatus.INACTIVE,
      };

      const account: Account = {
        userId,
        email: 'johndoe@example.com',
        phone: '987654321',
        password:
          '$2b$10$ltlj7YNotGUMstfWblTgy.GjeGj1T9SHkwXB3w0V84qVed340nir.',
        identification: {
          firstName: dto.firstName as string,
          lastName: dto.lastName as string,
          documentType: DocumentType.DNI,
          documentNumber: '12345678',
        },
        status: dto.status as AccountStatus,
        createdAt: new Date('2023-10-14T23:03:44.904+00:00'),
        updatedAt: new Date(),
      };

      (repository.updateAccount as jest.Mock).mockResolvedValueOnce(account);

      const result: GenericResponseDto = await service.execute(userId, dto);

      expect(result.message).toBe('Account updated successfully');
    });

    it('should throw an error if account update fails', async () => {
      const userId = uuidv4();

      const dto: UpdateAccountRequestDto = {
        firstName: 'John F.',
        lastName: 'Doe',
        status: AccountStatus.INACTIVE,
      };

      (repository.updateAccount as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(service.execute(userId, dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
