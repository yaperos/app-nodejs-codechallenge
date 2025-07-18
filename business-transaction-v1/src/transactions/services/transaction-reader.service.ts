import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction.entity';
import { GetTransactionResponseDto } from '../dto/get-transaction-response.dto';
import { TransactionTypeResponseDto, TransactionStatusResponseDto } from '../dto/transaction-nested.dto';
import { ITransactionReader } from '../interfaces/transaction-reader.interface';
import { ApplicationPropertiesService } from '../../config/application-properties.service';

@Injectable()
export class TransactionReaderService implements ITransactionReader {
  private readonly logger = new Logger(TransactionReaderService.name);

  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    private readonly applicationProperties: ApplicationPropertiesService,
  ) { }

  async findAll(): Promise<GetTransactionResponseDto[]> {
    const transactions = await this.repo.find({
      order: { createdAt: 'DESC' }
    });
    return transactions.map(transaction01 =>
      this.buildGetTransactionResponse(transaction01)
    );
  }

  async findOne(id: string): Promise<GetTransactionResponseDto> {
    return this.getTrx(id);
  }

  async getTrx(transactionExternalId: string): Promise<GetTransactionResponseDto> {
    try {
      const transactionEntity = await this.repo.findOneBy({ id: transactionExternalId });
      if (!transactionEntity) {
        throw new NotFoundException(`Transaction with ID ${transactionExternalId} not found`);
      }

      return this.buildGetTransactionResponse(transactionEntity);

    } catch (error) {
      this.logger.error('Error obtaining transaction', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Database error while obtaining transaction');
    }
  }

  private buildGetTransactionResponse(entity: Transaction): GetTransactionResponseDto {
    // Usar applicationProperties para obtener las descripciones
    const transactionType = new TransactionTypeResponseDto(
      entity.transactionTypeCode,
      this.applicationProperties.getTransactionTypeDescription(entity.transactionTypeCode)
    );

    const transactionStatus = new TransactionStatusResponseDto(
      entity.status,
      this.getStatusDescription(entity.status)
    );

    return new GetTransactionResponseDto(
      entity.id,
      transactionType,
      transactionStatus,
      entity.amount,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private getStatusDescription(status: string): string {
    const trxStatuses = this.applicationProperties.getTrxStatuses();

    // Mapear los estados usando la configuración
    const statusMap: Record<string, string> = {
      [trxStatuses.pending]: 'Transacción pendiente',
      [trxStatuses.approved]: 'Transacción aprobada',
      [trxStatuses.rejected]: 'Transacción rechazada',
    };

    return statusMap[status] || 'Estado desconocido';
  }
}
