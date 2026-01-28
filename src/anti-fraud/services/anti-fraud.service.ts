import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

interface ValidationResult {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
  score?: number;
  rules?: string[];
}

@Injectable()
export class AntiFraudService implements OnModuleInit {
  private readonly logger = new Logger(AntiFraudService.name);
  private readonly MAX_AMOUNT = 1000;
  private readonly SUSPICIOUS_AMOUNTS = [999, 999.99, 1001, 1999];
  private transactionHistory: Map<string, { timestamp: number; amount: number }[]> = new Map();

  async onModuleInit() {
    this.logger.log('AntiFraudService inicializado');
    this.logger.log(`🔒 Límite máximo configurado: $${this.MAX_AMOUNT}`);
  }

  async validateTransaction(value: number): Promise<ValidationResult> {
    this.logger.log(`🔍 Validando transacción, valor: $${value}`);
    
    const rules = [
      {
        name: 'max_amount',
        check: (val: number) => val <= this.MAX_AMOUNT,
        weight: 0.6,
        message: `Monto excede el límite de $${this.MAX_AMOUNT}`,
      },
      {
        name: 'minimum_amount',
        check: (val: number) => val >= 1,
        weight: 0.1,
        message: 'Monto muy bajo (mínimo $1)',
      },
      {
        name: 'suspicious_amount',
        check: (val: number) => !this.SUSPICIOUS_AMOUNTS.includes(val),
        weight: 0.2,
        message: 'Monto sospechoso (posible evasión de límites)',
      },
      {
        name: 'round_amount',
        check: (val: number) => val % 100 !== 0 || val <= 1000,
        weight: 0.1,
        message: 'Monto redondo grande (posible fraude)',
      },
    ];

    let score = 0;
    let totalWeight = 0;
    const failedRules: string[] = [];

    for (const rule of rules) {
      if (rule.check(value)) {
        score += rule.weight;
      } else {
        failedRules.push(rule.message);
      }
      totalWeight += rule.weight;
    }

    const finalScore = totalWeight > 0 ? score / totalWeight : 0;
    const threshold = 0.7;

    this.logger.debug(`📈 Score de validación: ${finalScore.toFixed(2)}`);

    if (finalScore >= threshold) {
      this.logger.log(`✅ Transacción APROBADA, valor: $${value}, score: ${finalScore.toFixed(2)}`);
      return {
        status: 'approved',
        score: finalScore,
        rules: failedRules.length > 0 ? failedRules : undefined,
      };
    } else {
      const rejectionReason = failedRules.join('; ');
      this.logger.warn(`❌ Transacción RECHAZADA, valor: $${value}, razones: ${rejectionReason}`);
      return {
        status: 'rejected',
        rejectionReason,
        score: finalScore,
        rules: failedRules,
      };
    }
  }

  async validateTransactionWithHistory(
    value: number,
    accountId: string,
  ): Promise<ValidationResult> {
    const basicValidation = await this.validateTransaction(value);
    
    if (basicValidation.status === 'rejected') {
      return basicValidation;
    }

    // Verificar historial de transacciones
    const history = this.transactionHistory.get(accountId) || [];
    const now = Date.now();
    const lastHour = now - 60 * 60 * 1000;

    // Filtrar transacciones de la última hora
    const recentTransactions = history.filter(t => t.timestamp > lastHour);
    
    // Calcular total en la última hora
    const totalLastHour = recentTransactions.reduce((sum, t) => sum + t.amount, 0) + value;

    // Regla: máximo $5000 por hora por cuenta
    if (totalLastHour > 5000) {
      this.logger.warn(`⚠️  Límite horario excedido para cuenta ${accountId}: $${totalLastHour}`);
      return {
        status: 'rejected',
        rejectionReason: `Límite horario excedido ($${totalLastHour} > $5000)`,
        score: 0.5,
      };
    }

    // Regla: máximo 10 transacciones por hora
    if (recentTransactions.length >= 10) {
      this.logger.warn(`⚠️  Demasiadas transacciones para cuenta ${accountId}: ${recentTransactions.length + 1}`);
      return {
        status: 'rejected',
        rejectionReason: 'Demasiadas transacciones en la última hora',
        score: 0.5,
      };
    }

    // Agregar transacción al historial
    history.push({ timestamp: now, amount: value });
    this.transactionHistory.set(accountId, history);

    // Limpiar historial antiguo (más de 24 horas)
    this.cleanOldHistory();

    return basicValidation;
  }

  private cleanOldHistory(): void {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    for (const [accountId, history] of this.transactionHistory.entries()) {
      const recentHistory = history.filter(t => t.timestamp > twentyFourHoursAgo);
      
      if (recentHistory.length === 0) {
        this.transactionHistory.delete(accountId);
      } else {
        this.transactionHistory.set(accountId, recentHistory);
      }
    }
  }

  async simulateKafkaConsumer(message: any): Promise<void> {
    this.logger.debug(`📨 Recibiendo mensaje de Kafka: ${JSON.stringify(message)}`);
    
    const { transactionExternalId, value, accountId } = message;
    
    const validationResult = await this.validateTransactionWithHistory(
      value,
      accountId || 'unknown',
    );

    // En un escenario real, aquí enviaríamos la respuesta a Kafka
    this.logger.log(
      `📤 Simulando envío a Kafka - Transacción: ${transactionExternalId}, Resultado: ${validationResult.status}`,
    );
  }

  getValidationRules(): Array<{
    name: string;
    description: string;
    weight: number;
  }> {
    return [
      {
        name: 'max_amount',
        description: `Monto máximo permitido: $${this.MAX_AMOUNT}`,
        weight: 0.6,
      },
      {
        name: 'minimum_amount',
        description: 'Monto mínimo: $1',
        weight: 0.1,
      },
      {
        name: 'suspicious_amount',
        description: 'Evitar montos sospechosos ($999, $999.99, etc.)',
        weight: 0.2,
      },
      {
        name: 'round_amount',
        description: 'Montos redondos grandes pueden ser sospechosos',
        weight: 0.1,
      },
    ];
  }

  async resetHistory(accountId?: string): Promise<void> {
    if (accountId) {
      this.transactionHistory.delete(accountId);
      this.logger.log(`🧹 Historial limpiado para cuenta: ${accountId}`);
    } else {
      this.transactionHistory.clear();
      this.logger.log('🧹 Todo el historial limpiado');
    }
  }
}