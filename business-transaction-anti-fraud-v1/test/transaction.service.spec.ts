import { Test, TestingModule } from '@nestjs/testing';
import { ConfigType } from '@nestjs/config';
import { TransactionService } from '../src/service/transaction.service';
import { applicationConfig } from '../src/config/kafka.config';
import { RawTransaction } from '../src/model/raw-transaction.model';
import { ValidationResult } from '../src/model/validation-result.model';
import { of, throwError } from 'rxjs';

describe('TransactionService', () => {
  let service: TransactionService;
  let mockAppConfiguration: ConfigType<typeof applicationConfig>;

  // ✅ Setup común antes de cada test
  beforeEach(async () => {
    // ✅ Mock de la configuración de aplicación
    mockAppConfiguration = {
      name: 'business-transaction-anti-fraud',
      server: {
        port: 8085,
        basePath: '/transaction-anti-fraud/v1',
      },
      maximumTransactionAmount: 1000, // ✅ Valor conocido para testing
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: applicationConfig.KEY,
          useValue: mockAppConfiguration,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  // ✅ Test de inicialización
  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have access to application configuration', () => {
      expect(service['appConfiguration']).toBeDefined();
      expect(service['appConfiguration'].maximumTransactionAmount).toBe(1000);
    });

    it('should have correct REASON constant', () => {
      expect(TransactionService.REASON).toBe('Transaction amount exceeds the maximum allowed amount');
    });
  });

  // ✅ Tests para el método principal analyzeTrx
  describe('analyzeTrx', () => {
    
    // ✅ Test para transacciones legítimas (casos de éxito)
    describe('Legitimate transactions', () => {
      it('should approve transaction when amount equals the limit', (done) => {
        // Arrange
        const transaction = RawTransaction.builder()
          .id('TXN-LIMIT')
          .amount(1000) // Exactamente en el límite
          .currency('USD')
          .build();

        // Act
        service.analyzeTrx(of(transaction)).subscribe({
          next: (result: ValidationResult) => {
            // Assert
            expect(result).toBeInstanceOf(ValidationResult);
            expect(result.getIsFraudulent()).toBe(false);
            expect(result.getTransactionId()).toBe('TXN-LIMIT');
            expect(result.getReason()).toBeUndefined();
            done();
          },
          error: done.fail
        });
      });

      it('should approve transaction when amount is below the limit', (done) => {
        // Arrange
        const transaction = RawTransaction.builder()
          .id('TXN-VALID')
          .amount(500.50) // Cantidad decimal válida
          .currency('EUR')
          .build();

        // Act
        service.analyzeTrx(of(transaction)).subscribe({
          next: (result: ValidationResult) => {
            // Assert
            expect(result).toBeInstanceOf(ValidationResult);
            expect(result.getIsFraudulent()).toBe(false);
            expect(result.getTransactionId()).toBe('TXN-VALID');
            expect(result.getReason()).toBeUndefined();
            done();
          },
          error: done.fail
        });
      });

      it('should approve transaction with minimum amount', (done) => {
        // Arrange - Caso edge: monto mínimo
        const transaction = RawTransaction.builder()
          .id('TXN-MIN')
          .amount(0.01) // Monto mínimo
          .currency('USD')
          .build();

        // Act
        service.analyzeTrx(of(transaction)).subscribe({
          next: (result: ValidationResult) => {
            // Assert
            expect(result.getIsFraudulent()).toBe(false);
            expect(result.getTransactionId()).toBe('TXN-MIN');
            done();
          },
          error: done.fail
        });
      });
    });

    // ✅ Tests para transacciones fraudulentas (casos de fraude)
    describe('Fraudulent transactions', () => {
      it('should detect fraud when amount exceeds the limit', (done) => {
        // Arrange
        const transaction = RawTransaction.builder()
          .id('TXN-FRAUD')
          .amount(1500.75) // Excede el límite
          .currency('USD')
          .build();

        // Act
        service.analyzeTrx(of(transaction)).subscribe({
          next: (result: ValidationResult) => {
            // Assert
            expect(result).toBeInstanceOf(ValidationResult);
            expect(result.getIsFraudulent()).toBe(true);
            expect(result.getTransactionId()).toBe('TXN-FRAUD');
            expect(result.getReason()).toBe(TransactionService.REASON);
            done();
          },
          error: done.fail
        });
      });

      it('should detect fraud when amount significantly exceeds the limit', (done) => {
        // Arrange - Caso extremo: monto muy alto
        const transaction = RawTransaction.builder()
          .id('TXN-HIGH-FRAUD')
          .amount(10000) // Muy por encima del límite
          .currency('EUR')
          .build();

        // Act
        service.analyzeTrx(of(transaction)).subscribe({
          next: (result: ValidationResult) => {
            // Assert
            expect(result.getIsFraudulent()).toBe(true);
            expect(result.getTransactionId()).toBe('TXN-HIGH-FRAUD');
            expect(result.getReason()).toBe(TransactionService.REASON);
            done();
          },
          error: done.fail
        });
      });

      it('should detect fraud when amount is just above the limit', (done) => {
        // Arrange - Caso edge: justo por encima del límite
        const transaction = RawTransaction.builder()
          .id('TXN-EDGE-FRAUD')
          .amount(1000.01) // Apenas por encima
          .currency('USD')
          .build();

        // Act
        service.analyzeTrx(of(transaction)).subscribe({
          next: (result: ValidationResult) => {
            // Assert
            expect(result.getIsFraudulent()).toBe(true);
            expect(result.getTransactionId()).toBe('TXN-EDGE-FRAUD');
            expect(result.getReason()).toBe(TransactionService.REASON);
            done();
          },
          error: done.fail
        });
      });
    });

    // ✅ Tests para casos edge y configuración dinámica
    describe('Edge cases and configuration', () => {
      it('should work with different configuration limits', async () => {
        // Arrange - Cambiar la configuración para este test
        const customConfig = {
          ...mockAppConfiguration,
          maximumTransactionAmount: 500, // Límite más bajo
        };

        const customModule: TestingModule = await Test.createTestingModule({
          providers: [
            TransactionService,
            {
              provide: applicationConfig.KEY,
              useValue: customConfig,
            },
          ],
        }).compile();

        const customService = customModule.get<TransactionService>(TransactionService);
        
        const transaction = RawTransaction.builder()
          .id('TXN-CUSTOM')
          .amount(600) // Sería válido con límite de 1000, pero no con 500
          .currency('USD')
          .build();

        return new Promise<void>((resolve, reject) => {
          customService.analyzeTrx(of(transaction)).subscribe({
            next: (result: ValidationResult) => {
              expect(result.getIsFraudulent()).toBe(true); // Debería ser fraude con límite de 500
              expect(result.getReason()).toBe(TransactionService.REASON);
              resolve();
            },
            error: reject
          });
        });
      });

      it('should handle zero amount transaction', (done) => {
        // Arrange - Caso edge: monto cero
        const transaction = RawTransaction.builder()
          .id('TXN-ZERO')
          .amount(0) // Monto cero
          .currency('USD')
          .build();

        // Act
        service.analyzeTrx(of(transaction)).subscribe({
          next: (result: ValidationResult) => {
            // Assert - Monto cero debería ser legítimo
            expect(result.getIsFraudulent()).toBe(false);
            expect(result.getTransactionId()).toBe('TXN-ZERO');
            done();
          },
          error: done.fail
        });
      });
    });

    // ✅ Tests para manejo de errores
    describe('Error handling', () => {
      it('should propagate Observable errors', (done) => {
        // Arrange - Observable que emite error
        const errorObservable = throwError(() => new Error('Transaction processing error'));

        // Act & Assert
        service.analyzeTrx(errorObservable).subscribe({
          next: () => done.fail('Should not emit value'),
          error: (error) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Transaction processing error');
            done();
          }
        });
      });

      it('should handle undefined transaction amounts gracefully', (done) => {
        // Arrange - Transacción con monto undefined (caso edge poco probable)
        const transaction = RawTransaction.builder()
          .id('TXN-UNDEFINED')
          .amount(undefined as any) // Simular caso edge
          .currency('USD')
          .build();

        // Act
        service.analyzeTrx(of(transaction)).subscribe({
          next: (result: ValidationResult) => {
            // Assert - undefined > 1000 es false, así que debería ser legítimo
            expect(result.getIsFraudulent()).toBe(false);
            done();
          },
          error: done.fail
        });
      });
    });
  });

  // ✅ Tests para métodos privados (a través de la interfaz pública)
  describe('Private methods behavior', () => {
    it('should create legitimate result with correct structure', (done) => {
      // Arrange
      const transaction = RawTransaction.builder()
        .id('TXN-STRUCTURE-TEST')
        .amount(100)
        .currency('USD')
        .build();

      // Act - Testear método privado createLegitimateResult a través de analyzeTrx
      service.analyzeTrx(of(transaction)).subscribe({
        next: (result: ValidationResult) => {
          // Assert - Verificar estructura del resultado legítimo
          expect(result.getIsFraudulent()).toBe(false);
          expect(result.getTransactionId()).toBe('TXN-STRUCTURE-TEST');
          expect(result.getReason()).toBeUndefined(); // No debería tener razón para legítimos
          done();
        },
        error: done.fail
      });
    });

    it('should create fraudulent result with correct structure', (done) => {
      // Arrange
      const transaction = RawTransaction.builder()
        .id('TXN-FRAUD-STRUCTURE')
        .amount(2000)
        .currency('USD')
        .build();

      // Act - Testear método privado createFraudulentResult a través de analyzeTrx
      service.analyzeTrx(of(transaction)).subscribe({
        next: (result: ValidationResult) => {
          // Assert - Verificar estructura del resultado fraudulento
          expect(result.getIsFraudulent()).toBe(true);
          expect(result.getTransactionId()).toBe('TXN-FRAUD-STRUCTURE');
          expect(result.getReason()).toBe(TransactionService.REASON); // Debe tener razón
          done();
        },
        error: done.fail
      });
    });
  });

  // ✅ Tests de logging (verificar que se hagan los logs correctos)
  describe('Logging behavior', () => {
    let loggerSpy: jest.SpyInstance;

    beforeEach(() => {
      loggerSpy = jest.spyOn(service['logger'], 'log');
    });

    afterEach(() => {
      loggerSpy.mockRestore();
    });

    it('should log legitimate transaction with correct message', (done) => {
      // Arrange
      const transaction = RawTransaction.builder()
        .id('TXN-LOG-LEGIT')
        .amount(500)
        .currency('USD')
        .build();

      // Act
      service.analyzeTrx(of(transaction)).subscribe({
        next: () => {
          // Assert - Verificar que se hizo el log correcto
          expect(loggerSpy).toHaveBeenCalledWith(
            '✅ LEGITIMATE transaction TXN-LOG-LEGIT: amount 500 <= limit 1000'
          );
          done();
        },
        error: done.fail
      });
    });

    it('should log fraudulent transaction with correct message', (done) => {
      // Arrange
      const transaction = RawTransaction.builder()
        .id('TXN-LOG-FRAUD')
        .amount(1500)
        .currency('USD')
        .build();

      // Act
      service.analyzeTrx(of(transaction)).subscribe({
        next: () => {
          // Assert - Verificar que se hizo el log correcto
          expect(loggerSpy).toHaveBeenCalledWith(
            '🚨 FRAUD detected for TXN-LOG-FRAUD: amount 1500 > limit 1000'
          );
          done();
        },
        error: done.fail
      });
    });
  });
});
