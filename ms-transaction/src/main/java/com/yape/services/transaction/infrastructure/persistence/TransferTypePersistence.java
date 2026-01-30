package com.yape.services.transaction.infrastructure.persistence;

import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.domain.repository.TransferTypeRepository;
import com.yape.services.transaction.infrastructure.persistence.entity.TransferTypeEntity;
import com.yape.services.transaction.infrastructure.persistence.repository.TransferTypePostgresRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Persistence implementation for TransferTypeRepository using PostgreSQL.
 */
@ApplicationScoped
public class TransferTypePersistence implements TransferTypeRepository {

  private final TransferTypePostgresRepository repository;

  /**
   * Constructor for TransferTypePersistence.
   *
   * @param repository the PostgreSQL repository for transfer types
   */
  @Inject
  public TransferTypePersistence(TransferTypePostgresRepository repository) {
    this.repository = repository;
  }

  @Override
  @Transactional(Transactional.TxType.SUPPORTS)
  public Optional<TransferType> findById(Integer transferTypeId) {
    return Optional.ofNullable(repository.findByTransferTypeId(transferTypeId))
        .map(TransferTypePersistence::toDomain);
  }

  @Override
  @Transactional(Transactional.TxType.SUPPORTS)
  public List<TransferType> findAll() {
    List<TransferTypeEntity> entities = repository.findAllTransferTypes();
    return entities.stream()
        .map(TransferTypePersistence::toDomain)
        .toList();
  }

  private static TransferType toDomain(TransferTypeEntity entity) {
    if (entity == null) {
      return null;
    }

    return TransferType.builder()
        .transferTypeId(entity.getTransferTypeId())
        .code(entity.getCode())
        .name(entity.getName())
        .build();
  }

}
