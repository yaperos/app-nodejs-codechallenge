package com.yape.transaction.infrastructure.persistence.repository;

import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.infrastructure.persistence.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaTransactionRepository extends JpaRepository<TransactionEntity, Long> {

    Optional<TransactionEntity> findByExternalId(UUID externalId);

    @Modifying
    @Query("UPDATE TransactionEntity t SET t.status = :status, t.updatedAt = CURRENT_TIMESTAMP WHERE t.externalId = :externalId")
    int updateStatusByExternalId(@Param("externalId") UUID externalId, @Param("status") TransactionStatus status);
}
