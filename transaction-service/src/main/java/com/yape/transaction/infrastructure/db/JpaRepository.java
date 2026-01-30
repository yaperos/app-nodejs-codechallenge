
package com.yape.transaction.infrastructure.db;

import java.util.UUID;
import com.yape.transaction.infrastructure.db.entity.TransactionEntity;

public interface JpaRepository extends org.springframework.data.jpa.repository.JpaRepository<TransactionEntity, UUID> {
}
