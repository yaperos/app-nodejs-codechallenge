package com.yape.services.transaction.domain.repository;

import com.yape.services.transaction.domain.model.TransferType;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for transfer type data operations.
 */
public interface TransferTypeRepository {

  /**
   * Finds a transfer type by its ID.
   *
   * @param transferTypeId the ID of the transfer type
   * @return an Optional containing the transfer type, or empty if not found
   */
  Optional<TransferType> findById(Integer transferTypeId);

  /**
   * Retrieves all transfer types.
   *
   * @return a list of all transfer types
   */
  List<TransferType> findAll();

}
