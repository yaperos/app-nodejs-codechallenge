package com.yape.antifraud.infrastructure.persistence.adapter;

import com.yape.antifraud.domain.model.EvaluatedTransaction;
import com.yape.antifraud.domain.port.out.EvaluatedTransactionRepository;
import com.yape.antifraud.infrastructure.persistence.entity.EvaluatedTransactionEntity;
import com.yape.antifraud.infrastructure.persistence.repository.JpaEvaluatedTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Adapter that bridges the domain port (EvaluatedTransactionRepository)
 * with the Spring Data JPA infrastructure (JpaEvaluatedTransactionRepository).
 * Handles conversion between domain model and JPA entity.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EvaluatedTransactionRepositoryAdapter implements EvaluatedTransactionRepository {

    private final JpaEvaluatedTransactionRepository jpaRepository;

    @Override
    public boolean existsByTransactionId(UUID transactionId) {
        return jpaRepository.existsByTransactionId(transactionId);
    }

    @Override
    public void save(EvaluatedTransaction evaluatedTransaction) {
        EvaluatedTransactionEntity entity = toEntity(evaluatedTransaction);
        jpaRepository.save(entity);
        log.debug("Saved evaluated transaction: {}", evaluatedTransaction.getTransactionId());
    }

    @Override
    public Optional<EvaluatedTransaction> findByTransactionId(UUID transactionId) {
        return jpaRepository.findById(transactionId).map(this::toDomain);
    }

    private EvaluatedTransactionEntity toEntity(EvaluatedTransaction domain) {
        return EvaluatedTransactionEntity.builder()
                .transactionId(domain.getTransactionId())
                .status(domain.getStatus())
                .evaluatedAt(domain.getEvaluatedAt())
                .build();
    }

    private EvaluatedTransaction toDomain(EvaluatedTransactionEntity entity) {
        return EvaluatedTransaction.builder()
                .transactionId(entity.getTransactionId())
                .status(entity.getStatus())
                .evaluatedAt(entity.getEvaluatedAt())
                .build();
    }
}
