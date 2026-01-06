package com.yape.payment.transaction.infrastructure.db.repository;

import com.yape.payment.transaction.infrastructure.db.entity.OutboxEventEntity;
import com.yape.payment.transaction.infrastructure.db.entity.OutboxEventEntity.OutboxStatus;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OutboxEventJpaRepository extends JpaRepository<OutboxEventEntity, Long> {
    List<OutboxEventEntity> findByStatusOrderByCreatedAtAsc(OutboxStatus status, Pageable pageable);
}