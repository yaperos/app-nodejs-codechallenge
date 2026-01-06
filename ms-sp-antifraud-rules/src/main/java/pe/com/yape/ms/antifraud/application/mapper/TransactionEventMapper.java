package pe.com.yape.ms.antifraud.application.mapper;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import pe.com.yape.ms.antifraud.application.dto.DebeziumTransactionDto;
import pe.com.yape.ms.antifraud.application.dto.TransactionValidatedDto;
import pe.com.yape.ms.antifraud.model.domain.Transaction;
import pe.com.yape.ms.antifraud.model.domain.TransactionValidation;

/**
 * Mapper entre eventos JSON y objetos de dominio
 * @author lmarusic
 */
public class TransactionEventMapper {

    private TransactionEventMapper() {
    }

    /**
     * Convierte un DTO JSON de Debezium a un objeto de dominio Transaction
     *
     * @param dto DTO desde Debezium CDC
     * @return Transaction
     */
    public static Transaction toDomain(DebeziumTransactionDto dto) {
        LocalDateTime sourceTimestamp = dto.sourceTsMs() != null 
            ? LocalDateTime.ofInstant(Instant.ofEpochMilli(dto.sourceTsMs()), ZoneOffset.UTC)
            : null;
            
        return new Transaction(
            dto.transactionExternalId(),
            dto.accountExternalIdDebit(),
            dto.accountExternalIdCredit(),
            dto.value() != null ? dto.value() : 0.0,
            dto.transferTypeId() != null ? dto.transferTypeId() : 0,
            dto.status(),
            dto.op(),
            sourceTimestamp
        );
    }

    /**
     * Convierte un objeto de dominio TransactionValidation a un DTO JSON
     *
     * @param validation Objeto de dominio con el resultado de validación
     * @return DTO JSON para publicar en Kafka
     */
    public static TransactionValidatedDto toDto(TransactionValidation validation) {
        return new TransactionValidatedDto(
            validation.transactionId(),
            validation.status().name(),
            validation.reason(),
            validation.validatedAt().toEpochMilli(),
            validation.amount()
        );
    }
}
