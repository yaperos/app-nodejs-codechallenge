package com.yape.transaction_service.service;

import com.yape.shared.TransactionCreatedEvent;
import com.yape.transaction_service.dto.CreateTransactionRequest;
import com.yape.transaction_service.dto.GetTransactionResponse;
import com.yape.transaction_service.entity.Transaction;
import com.yape.transaction_service.entity.TransactionStatus;
import com.yape.transaction_service.exception.InvalidTransactionException;
import com.yape.transaction_service.exception.TransactionNotFoundException;
import com.yape.transaction_service.producer.TransactionProducer;
import com.yape.transaction_service.repository.TransactionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@Slf4j
public class TransactionService {

    private final TransactionRepository repository;
    private final TransactionProducer producer;

    private static final BigDecimal MAX_AMOUNT = new BigDecimal("1000000");
    private static final int MIN_TRANSFER_TYPE_ID = 1;
    private static final int MAX_TRANSFER_TYPE_ID = 4;

    public TransactionService(TransactionRepository repository,
                              TransactionProducer producer) {
        this.repository = repository;
        this.producer = producer;
    }

    @Transactional
    public GetTransactionResponse create(CreateTransactionRequest request) {
        log.info("=== CREANDO NUEVA TRANSACCIÓN ===");

        validateRequestNotNull(request);

        validateRequiredFields(request);

        validateBusinessRules(request);

        Transaction transaction = buildTransaction(request);

        Transaction saved = repository.save(transaction);
        log.info("Transacción guardada con ID: {}", saved.getTransactionExternalId());

        sendToKafka(saved);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public GetTransactionResponse getByExternalId(UUID externalId) {
        log.debug("=== BUSCANDO TRANSACCIÓN ===");

        validateExternalId(externalId);

        Transaction transaction = repository
                .findByTransactionExternalId(externalId)
                .orElseThrow(() -> new TransactionNotFoundException(
                        String.format("Transacción no encontrada con ID: %s", externalId)
                ));

        log.info("✅ Transacción encontrada: {}", externalId);
        return mapToResponse(transaction);
    }

    // ========== MÉTODOS DE VALIDACIÓN ==========

    private void validateRequestNotNull(CreateTransactionRequest request) {
        if (request == null) {
            log.error("Request es null");
            throw new InvalidTransactionException("La solicitud no puede ser null");
        }
    }

    private void validateRequiredFields(CreateTransactionRequest request) {
        // Validar cuenta débito
        if (request.getAccountExternalIdDebit() == null) {
            log.error("accountExternalIdDebit es null");
            throw new InvalidTransactionException("La cuenta débito es requerida");
        }

        // Validar cuenta crédito
        if (request.getAccountExternalIdCredit() == null) {
            log.error("accountExternalIdCredit es null");
            throw new InvalidTransactionException("La cuenta crédito es requerida");
        }

        // Validar tipo de transferencia
        if (request.getTransferTypeId() == null) {
            log.error("transferTypeId es null");
            throw new InvalidTransactionException("El tipo de transferencia es requerido");
        }

        // Validar valor
        if (request.getValue() == null) {
            log.error("value es null");
            throw new InvalidTransactionException("El valor de la transacción es requerido");
        }
    }

    private void validateBusinessRules(CreateTransactionRequest request) {
        // Regla 1: Cuentas deben ser diferentes
        if (request.getAccountExternalIdDebit().equals(request.getAccountExternalIdCredit())) {
            log.error("Cuentas débito y crédito son iguales");
            throw new InvalidTransactionException(
                    "Las cuentas débito y crédito deben ser diferentes"
            );
        }

        // Regla 2: Tipo de transferencia válido
        if (request.getTransferTypeId() < MIN_TRANSFER_TYPE_ID ||
                request.getTransferTypeId() > MAX_TRANSFER_TYPE_ID) {
            log.error("Tipo de transferencia inválido: {}", request.getTransferTypeId());
            throw new InvalidTransactionException(
                    String.format("Tipo de transferencia inválido. Debe ser entre %d y %d",
                            MIN_TRANSFER_TYPE_ID, MAX_TRANSFER_TYPE_ID)
            );
        }

        // Regla 3: Valor positivo
        if (request.getValue().compareTo(BigDecimal.ZERO) <= 0) {
            log.error("Valor no positivo: {}", request.getValue());
            throw new InvalidTransactionException("El valor debe ser mayor a cero");
        }

        // Regla 4: Valor dentro del límite
        if (request.getValue().compareTo(MAX_AMOUNT) > 0) {
            log.error("Valor excede límite: {} > {}", request.getValue(), MAX_AMOUNT);
            throw new InvalidTransactionException(
                    String.format("El valor excede el máximo permitido de %s", MAX_AMOUNT)
            );
        }

        log.info("Validaciones de negocio pasadas exitosamente");
    }

    private void validateExternalId(UUID externalId) {
        if (externalId == null) {
            log.error("ExternalId es null");
            throw new IllegalArgumentException("El ID de transacción no puede ser null");
        }
    }

    // ========== MÉTODOS AUXILIARES ==========

    private Transaction buildTransaction(CreateTransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setAccountExternalIdDebit(request.getAccountExternalIdDebit());
        transaction.setAccountExternalIdCredit(request.getAccountExternalIdCredit());
        transaction.setTransferTypeId(request.getTransferTypeId());
        transaction.setValue(request.getValue());
        transaction.setStatus(TransactionStatus.PENDING);
        return transaction;
    }

    private void sendToKafka(Transaction transaction) {
        try {
            producer.sendTransactionCreated(
                    new TransactionCreatedEvent(
                            transaction.getTransactionExternalId(),
                            transaction.getValue()
                    )
            );
            log.info("Evento enviado a Kafka para transacción: {}",
                    transaction.getTransactionExternalId());
        } catch (Exception e) {
            log.error("Error enviando evento a Kafka para transacción: {}",
                    transaction.getTransactionExternalId(), e);
            // Aquí podrías implementar lógica de reintento
        }
    }

    private GetTransactionResponse mapToResponse(Transaction t) {
        if (t == null) {
            throw new IllegalArgumentException("La transacción no puede ser null");
        }

        return new GetTransactionResponse(
                t.getTransactionExternalId(),
                new GetTransactionResponse.TransactionType(
                        getTransferTypeName(t.getTransferTypeId())
                ),
                new GetTransactionResponse.TransactionStatusResponse(
                        t.getStatus() != null ? t.getStatus().name().toLowerCase() : "desconocido"
                ),
                t.getValue(),
                t.getCreatedAt()
        );
    }

    private String getTransferTypeName(Integer transferTypeId) {
        if (transferTypeId == null) {
            log.warn("TransferTypeId es null, usando valor por defecto");
            return "DESCONOCIDO";
        }

        return switch (transferTypeId) {
            case 1 -> "TRANSFERENCIA";
            case 2 -> "PAGO";
            case 3 -> "RETIRO";
            case 4 -> "DEPOSITO";
            default -> {
                log.warn("TransferTypeId inválido: {}, usando DESCONOCIDO", transferTypeId);
                yield "DESCONOCIDO";
            }
        };
    }
}