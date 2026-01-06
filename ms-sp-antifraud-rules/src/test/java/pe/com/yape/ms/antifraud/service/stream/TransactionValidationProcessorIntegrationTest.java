package pe.com.yape.ms.antifraud.service.stream;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.function.Consumer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.stream.function.StreamBridge;

import com.fasterxml.jackson.databind.ObjectMapper;

import pe.com.yape.ms.antifraud.service.impl.AntiFraudValidationServiceImpl;

/**
 * Test de integración para el procesador de transacciones validando flujo completo end-to-end
 * @author lmarusic
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Transaction Validation Processor Integration Tests")
class TransactionValidationProcessorIntegrationTest {

    @Mock
    private StreamBridge streamBridge;

    private Consumer<String> processor;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        AntiFraudValidationServiceImpl validationService = new AntiFraudValidationServiceImpl();
        TransactionValidationProcessor processorConfig = 
            new TransactionValidationProcessor(validationService, streamBridge, objectMapper);
        processor = processorConfig.processTransaction();
    }

    @Test
    @DisplayName("Should process and publish APPROVED transaction with amount less than 1000")
    void shouldProcessAndApproveTransactionWithAmountLessThan1000() throws Exception {
        // Given: Evento JSON de Debezium con monto < 1000 y operación CREATE
        String json = """
            {
                "transaction_external_id": "550e8400-e29b-41d4-a716-446655440000",
                "account_external_id_debit": "debit-account-001",
                "account_external_id_credit": "credit-account-001",
                "tranfer_type_id": 1,
                "value": 750.0,
                "status": "PENDING",
                "__op": "c",
                "__source_ts_ms": %d
            }
            """.formatted(System.currentTimeMillis());

        // When: Procesar el evento
        processor.accept(json);

        // Then: Verificar que se publicó un mensaje
        verify(streamBridge, times(1)).send(eq("processTransaction-out-0"), any());
    }

    @Test
    @DisplayName("Should process and publish REJECTED transaction with amount greater than 1000")
    void shouldProcessAndRejectTransactionWithAmountGreaterThan1000() {
        // Given: Evento JSON de Debezium con monto > 1000
        DebeziumTransactionDto dto = new DebeziumTransactionDto(
            "550e8400-e29b-41d4-a716-446655440001",
            "debit-account-002",
            "credit-account-002",
            1,
            1500.0,
            "PENDING",
            "c",
            System.currentTimeMillis()
        );

        // When: Procesar el evento
        processor.accept(dto);

        // Then: Verificar que se publicó un mensaje
        verify(streamBridge, times(1)).send(eq("processTransaction-out-0"), any());
    }

    @Test
    @DisplayName("Should process transaction with amount exactly at threshold (1000)")
    void shouldProcessTransactionWithAmountExactlyAtThreshold() {
        // Given: Evento con monto exactamente en el límite
        DebeziumTransactionDto dto = new DebeziumTransactionDto(
            "550e8400-e29b-41d4-a716-446655440002",
            "debit-account-003",
            "credit-account-003",
            1,
            1000.0,
            "PENDING",
            "c",
            System.currentTimeMillis()
        );

        // When: Procesar el evento
        processor.accept(dto);

        // Then: Verificar que se publicó un mensaje
        verify(streamBridge, times(1)).send(eq("processTransaction-out-0"), any());
    }

    @Test
    @DisplayName("Should skip update operations (op='u')")
    void shouldSkipUpdateOperations() {
        // Given: Evento de actualización
        DebeziumTransactionDto dto = new DebeziumTransactionDto(
            "550e8400-e29b-41d4-a716-446655440005",
            "debit-account-006",
            "credit-account-006",
            1,
            500.0,
            "APPROVED",
            "u",
            System.currentTimeMillis()
        );

        // When: Procesar el evento
        processor.accept(dto);

        // Then: No se debe publicar ningún mensaje
        verify(streamBridge, times(0)).send(any(), any());
    }

    @Test
    @DisplayName("Should skip delete operations (op='d')")
    void shouldSkipDeleteOperations() {
        // Given: Evento de eliminación
        DebeziumTransactionDto dto = new DebeziumTransactionDto(
            "550e8400-e29b-41d4-a716-446655440006",
            "debit-account-007",
            "credit-account-007",
            1,
            500.0,
            "REJECTED",
            "d",
            System.currentTimeMillis()
        );

        // When: Procesar el evento
        processor.accept(dto);

        // Then: No se debe publicar ningún mensaje
        verify(streamBridge, times(0)).send(any(), any());
    }

    @Test
    @DisplayName("Should handle transaction with very high amount")
    void shouldHandleTransactionWithVeryHighAmount() {
        // Given: Evento con monto muy alto
        DebeziumTransactionDto dto = new DebeziumTransactionDto(
            "550e8400-e29b-41d4-a716-446655440003",
            "debit-account-004",
            "credit-account-004",
            1,
            100000.0,
            "PENDING",
            "c",
            System.currentTimeMillis()
        );

        // When: Procesar el evento
        processor.accept(dto);

        // Then: Verificar que se publicó un mensaje
        verify(streamBridge, times(1)).send(eq("processTransaction-out-0"), any());
    }
}
