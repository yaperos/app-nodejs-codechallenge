import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAccountRequestDto } from 'src/accounts/domain/dto/create-account-request.dto';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';
import { Account } from 'src/accounts/domain/entity/account';
import { AccountRepository } from 'src/accounts/domain/repository/account-repository';
import { CreateAccount } from 'src/accounts/domain/use-case/create-account';
import { PasswordEncoder } from 'src/common/util/password-encoder';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateAccountImpl implements CreateAccount {
  public constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(
    dto: CreateAccountRequestDto,
  ): Promise<GenericResponseDto> {
    try {
      const account: Partial<Account> = {
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
      };
      await this.accountRepository.createAccount(account);

      return GenericResponseDto.builder()
        .message('Account created successfully')
        .build();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
