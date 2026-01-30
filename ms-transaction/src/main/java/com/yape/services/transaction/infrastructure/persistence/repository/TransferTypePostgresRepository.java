package com.yape.services.transaction.infrastructure.persistence.repository;

import com.yape.services.transaction.infrastructure.persistence.entity.TransferTypeEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

/**
 * Repository for transfer type entities in PostgreSQL using Panache.
 */
@ApplicationScoped
public class TransferTypePostgresRepository
    implements PanacheRepositoryBase<TransferTypeEntity, Integer> {

  /**
   * Finds a transfer type entity by its transfer ID.
   *
   * @param transferTypeId the ID of the transfer type
   * @return the transfer type entity
   */
  public TransferTypeEntity findByTransferTypeId(Integer transferTypeId) {
    return find("transferTypeId", transferTypeId).firstResult();
  }

  /**
   * Finds all transfer type entities.
   *
   * @return list of all transfer type entities
   */
  public List<TransferTypeEntity> findAllTransferTypes() {
    return listAll();
  }

}
