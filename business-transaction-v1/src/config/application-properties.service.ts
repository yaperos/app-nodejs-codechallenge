import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TrxStatusesConfig } from './app.config';

/**
 * Application Properties Service
 */
@Injectable()
export class ApplicationPropertiesService {
  constructor(private configService: ConfigService) {}

  /**
   * Get transaction types map
   */
  getTrxTypes(): Record<string, string> {
    return this.configService.get<Record<string, string>>('application.trx-types', {});
  }

  /**
   * Get transaction statuses configuration
   */
  getTrxStatuses(): TrxStatusesConfig {
    return {
      pending: this.configService.get<string>('application.trx-statuses.pending', 'PENDING'),
      approved: this.configService.get<string>('application.trx-statuses.approved', 'APPROVED'),
      rejected: this.configService.get<string>('application.trx-statuses.rejected', 'REJECTED'),
    };
  }

  /**
   * Get specific transaction type description by code
   * Helper method for easy access
   */
  getTransactionTypeDescription(code: string): string {
    const trxTypes = this.getTrxTypes();
    return trxTypes[code] || 'Tipo de transacción desconocido';
  }

  /**
   * Get database configuration
   */
  getDatabaseConfig() {
    return {
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
    };
  }

  /**
   * Get server configuration
   */
  getServerConfig() {
    return {
      port: this.configService.get<number>('server.port'),
    };
  }

  /**
   * Get environment name
   */
  getEnvironment(): string {
    return this.configService.get<string>('environment', 'development');
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this.getEnvironment() === 'development';
  }

  /**
   * Get logging configuration
   */
  getLogLevel(): string {
    return this.configService.get<string>('logging.level', 'info');
  }

  /**
   * Get server port
   */
  getServerPort(): number {
    return this.configService.get<number>('server.port', 3000);
  }

  /**
   * Get security configuration
   */
  getSecurityConfig() {
    return {
      jwtSecret: this.configService.get<string>('security.jwtSecret'),
      corsOrigin: this.configService.get<string>('security.corsOrigin'),
    };
  }
}
