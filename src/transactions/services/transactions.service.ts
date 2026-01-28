import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { Transaction } from '../entities/transaction.entity';
import { AntiFraudConsumer } from '../../anti-fraud/consumers/anti-fraud.consumer';

@Injectable()
export class TransactionsService implements OnModuleInit {
  private readonly logger = new Logger(TransactionsService.name);
  private inMemoryCache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly antiFraudConsumer: AntiFraudConsumer,
  ) {}

  async onModuleInit() {
    this.logger.log('TransactionsService inicializado');
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    try {
      // Crear transacción
      const transaction = new Transaction();
      transaction.transactionExternalId = uuidv4();
      transaction.accountExternalIdDebit = createTransactionDto.accountExternalIdDebit;
      transaction.accountExternalIdCredit = createTransactionDto.accountExternalIdCredit;
      transaction.transferTypeId = createTransactionDto.transferTypeId;
      transaction.value = createTransactionDto.value;
      transaction.status = 'pending';

      // Guardar transacción
      const savedTransaction = await this.transactionRepository.save(transaction);

      // Enviar a validación antifraude (simulando Kafka)
      await this.antiFraudConsumer.processTransactionValidation(
        savedTransaction.transactionExternalId,
        savedTransaction.value,
        savedTransaction.accountExternalIdDebit,
      );

      this.logger.log(
        `✅ Transacción creada: ${savedTransaction.transactionExternalId}, valor: ${savedTransaction.value}`,
      );

      // Programar actualización del estado después de validación
      this.scheduleStatusCheck(savedTransaction.transactionExternalId);

      return this.mapToResponseDto(savedTransaction);
    } catch (error) {
      this.logger.error(`❌ Error creando transacción: ${error.message}`);
      throw error;
    }
  }

  private scheduleStatusCheck(transactionId: string): void {
    // Verificar el estado después de 2 segundos (simulando validación asíncrona)
    setTimeout(async () => {
      try {
        const transaction = await this.transactionRepository.findOne({
          where: { transactionExternalId: transactionId },
        });
        
        if (transaction && transaction.status === 'pending') {
          this.logger.warn(`⚠️  Transacción ${transactionId} sigue en pending después de validación`);
          // Forzar validación local si no se actualizó
          await this.validateLocally(transaction);
        }
      } catch (error) {
        this.logger.error(`❌ Error en scheduleStatusCheck: ${error.message}`);
      }
    }, 2000);
  }

  private async validateLocally(transaction: Transaction): Promise<void> {
    // Validación local de emergencia
    const status = transaction.value > 1000 ? 'rejected' : 'approved';
    const rejectionReason = status === 'rejected' 
      ? 'Amount exceeds limit (validación local)' 
      : undefined;
    
    await this.updateStatus(
      transaction.transactionExternalId,
      status,
      rejectionReason,
    );
    
    this.logger.log(`🔧 Validación local aplicada: ${transaction.transactionExternalId} -> ${status}`);
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    // Verificar caché en memoria
    const cacheKey = `transaction:${id}`;
    const cached = this.inMemoryCache.get(cacheKey);
    
    if (cached && cached.expiry > Date.now()) {
      this.logger.debug(`📦 Cache hit para transacción: ${id}`);
      return cached.data;
    }

    // Buscar en base de datos
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId: id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    const response = this.mapToResponseDto(transaction);

    // Guardar en caché
    this.inMemoryCache.set(cacheKey, {
      data: response,
      expiry: Date.now() + this.CACHE_TTL,
    });

    // Limpiar caché expirado periódicamente
    this.cleanExpiredCache();

    return response;
  }

  async findAll(): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });

    return transactions.map((transaction) =>
      this.mapToResponseDto(transaction),
    );
  }

  async updateStatus(
    transactionExternalId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string,
  ): Promise<void> {
    try {
      const result = await this.transactionRepository.update(
        { transactionExternalId },
        {
          status,
          rejectionReason,
          updatedAt: new Date(),
        },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Transacción ${transactionExternalId} no encontrada`);
      }

      // Invalidar caché
      this.inMemoryCache.delete(`transaction:${transactionExternalId}`);

      this.logger.log(
        `🔄 Estado actualizado: ${transactionExternalId} -> ${status}`,
      );

      if (status === 'rejected') {
        this.logger.warn(
          `🚫 Transacción rechazada: ${transactionExternalId}, razón: ${rejectionReason}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Error actualizando estado de transacción ${transactionExternalId}: ${error.message}`,
      );
      throw error;
    }
  }

  private mapToResponseDto(transaction: Transaction): TransactionResponseDto {
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: this.getTransactionTypeName(transaction.transferTypeId),
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: Number(transaction.value),
      createdAt: transaction.createdAt,
    };
  }

  private getTransactionTypeName(typeId: number): string {
    const types: Record<number, string> = {
      1: 'Deposit',
      2: 'Withdrawal',
      3: 'Transfer',
      4: 'Payment',
    };
    return types[typeId] || 'Unknown';
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.inMemoryCache.entries()) {
      if (value.expiry < now) {
        this.inMemoryCache.delete(key);
      }
    }
  }

  async getStatistics(): Promise<{
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    totalAmount: number;
  }> {
    const transactions = await this.transactionRepository.find();
    
    const stats = {
      total: transactions.length,
      approved: transactions.filter(t => t.status === 'approved').length,
      rejected: transactions.filter(t => t.status === 'rejected').length,
      pending: transactions.filter(t => t.status === 'pending').length,
      totalAmount: transactions.reduce((sum, t) => sum + Number(t.value), 0),
    };

    this.logger.debug(`📊 Estadísticas: ${JSON.stringify(stats)}`);
    return stats;
  }

  // Método para simular recepción de mensajes de validación desde Kafka
  async handleValidationResult(result: {
    transactionExternalId: string;
    status: 'approved' | 'rejected';
    rejectionReason?: string;
  }): Promise<void> {
    await this.updateStatus(
      result.transactionExternalId,
      result.status,
      result.rejectionReason,
    );
  }
}