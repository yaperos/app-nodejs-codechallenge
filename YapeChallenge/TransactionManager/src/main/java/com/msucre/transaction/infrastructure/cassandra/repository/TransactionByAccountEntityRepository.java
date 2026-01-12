package com.msucre.transaction.infrastructure.cassandra.repository;

import com.msucre.transaction.infrastructure.cassandra.entity.TransactionByAccountEntity;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.cassandra.repository.ReactiveCassandraRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface TransactionByAccountEntityRepository extends ReactiveCassandraRepository<TransactionByAccountEntity, UUID> {

  @Query("""
      SELECT
        *
      FROM
        transaction_by_account
      WHERE
        source_account_id = ?0
      """)
  Flux<TransactionByAccountEntity> findAllBySourceAccountId(final UUID sourceAccountId);
}