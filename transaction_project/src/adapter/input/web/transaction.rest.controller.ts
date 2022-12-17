import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { TransactionCreationUsecase } from 'src/domain/usecases/transaction_creation.usecase';
import { TransactionQueryUsecase } from 'src/domain/usecases/transaction_query_usecase';
import { FromTransactionCreationRequestDtoConverter } from './converter/from_transaction_creation_request_dto.converter';
import { FromTransactionDomainConverter } from './converter/from_transaction_domain.converter';
import { TransactionCreationRequestDto } from './dto/transaction_creation.request.dto';
import { TransactionQueryResponsetDto } from './dto/transaction_query.response.dto';
@Controller('transaction')
export class TransactionRestController {
  constructor(
    private readonly transactionCreationUsecase: TransactionCreationUsecase,
    private readonly transactionQueryUsecase: TransactionQueryUsecase,
    private readonly fromTransactionCreationRequestDtoConverter: FromTransactionCreationRequestDtoConverter,
    private readonly fromTransactionDomainConverter: FromTransactionDomainConverter,
  ) {}

  @Get(':transactionId')
  findOne(
    @Param('transactionId') transactionId: string,
  ): Observable<TransactionQueryResponsetDto> {
    return this.transactionQueryUsecase.findById(transactionId).pipe(
      map((tx) => {
        const dto =
          this.fromTransactionDomainConverter.toTransactionQueryResponseDto(tx);
        console.log(
          'TransactionRestController query response dto: ' +
            JSON.stringify(dto),
        );
        return dto;
      }),
    );
  }

  @Post()
  async create(
    @Body(ValidationPipe) transactionDto: TransactionCreationRequestDto,
  ) {
    console.log(
      '>> TX TransactionRestController: Incoming REST request: ' +
        JSON.stringify(transactionDto),
    );

    return this.transactionCreationUsecase
      .create(
        this.fromTransactionCreationRequestDtoConverter.toTransactionEntity(
          transactionDto,
        ),
      )
      .pipe(
        map((tx) => {
          return this.fromTransactionDomainConverter.toTransactionCreationResponseDto(
            tx,
          );
        }),
      );
  }
}
