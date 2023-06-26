import {AutomapperProfile, InjectMapper} from '@automapper/nestjs';
import {
  createMap,
  forMember,
  ignore,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import {Injectable} from '@nestjs/common';
import {TransactionCreateDTO} from 'src/transaction/dtos/transaction.create.dto';
import {Transaction} from './transaction.entity';
import {TransactionReadDTO} from 'src/transaction/dtos/transaction.read.dto';
import {CreateTransactionCommand} from 'src/operations/commands/create/create.transaction.command';

@Injectable()
export class TransactionProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return mapper => {
      createMap(
        mapper,
        Transaction,
        TransactionReadDTO,
        forMember(
          destination => destination.transactionStatus.name,
          mapFrom(source => source.status),
        ),
        forMember(
          destination => destination.transactionType.name,
          mapFrom(source => source.tranferTypeId),
        ),
      );
      createMap(
        mapper,
        TransactionCreateDTO,
        Transaction,
        forMember(dest => dest.transactionExternalId, ignore()),
      );
      createMap(mapper, TransactionCreateDTO, CreateTransactionCommand);
      createMap(mapper, CreateTransactionCommand, Transaction);
    };
  }
}
