package pe.com.yape.ms.antifraud.service.stream;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.stream.function.StreamBridge;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import pe.com.yape.ms.antifraud.application.dto.DebeziumTransactionDto;
import pe.com.yape.ms.antifraud.application.dto.TransactionValidatedDto;
import pe.com.yape.ms.antifraud.application.mapper.TransactionEventMapper;
import pe.com.yape.ms.antifraud.model.domain.Transaction;
import pe.com.yape.ms.antifraud.model.domain.TransactionValidation;
import pe.com.yape.ms.antifraud.service.AntiFraudValidationService;

/**
 * Procesador de eventos de Kafka usando Spring Cloud Stream
 * @author lmarusic
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class TransactionValidationProcessor {

    private static final String OPERATION_CREATE = "c";
    private static final String OUTPUT_BINDING = "processTransaction-out-0";
    
    private final AntiFraudValidationService validationService;
    private final StreamBridge streamBridge;
    private final ObjectMapper objectMapper;

    /**
     * Procesa eventos de transacciones desde Debezium CDC (JSON)
     * Filtra solo operaciones CREATE y valida contra reglas antifraude
     *
     * @return Consumer que procesa mensajes JSON y publica TransactionValidatedEvent
     */
    @Bean
    public Consumer<String> processTransaction() {
        return json -> {
            try {
                log.info("Received raw JSON: {}", json);
                
                // Deserializar JSON a DTO
                DebeziumTransactionDto dto = objectMapper.readValue(json, DebeziumTransactionDto.class);
                
                log.info("Received transaction event: {} with operation: {}", 
                    dto.transactionExternalId(), 
                    dto.op());

                if (!isCreateOperation(dto)) {
                    log.info("Skipping non-create operation for transaction: {}", 
                        dto.transactionExternalId());
                    return;
                }

                log.info("Processing CREATE transaction event: {}", 
                    dto.transactionExternalId());

                Transaction transaction = TransactionEventMapper.toDomain(dto);
                TransactionValidation validation = validationService.validate(transaction);
                TransactionValidatedDto validatedDto = 
                    TransactionEventMapper.toDto(validation);

                log.info("Transaction {} validated with status: {}", 
                    validation.transactionId(), 
                    validation.status());

                // Publicar evento al topic de salida
                streamBridge.send(OUTPUT_BINDING, validatedDto);
                
                log.info("Published validation result for transaction: {}", 
                    validation.transactionId());

            } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
                log.error("Error parsing JSON message: {}", json, e);
            } catch (Exception e) {
                log.error("Error processing transaction", e);
            }
        };
    }

    /**
     * Verifica si el evento de transacción es una operación de creación
     *
     * @param dto DTO de Debezium
     * @return true si es operación CREATE
     */
    private boolean isCreateOperation(DebeziumTransactionDto dto) {
        return dto.op() != null && OPERATION_CREATE.equals(dto.op());
    }
}

