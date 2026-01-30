package com.yape.services.transaction.domain.service;

import com.yape.services.transaction.domain.model.TransferType;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing transfer type cache operations.
 */
public interface TransferTypeCacheService {

  /**
   * Save a transfer type to the cache.
   *
   * @param transferType the transfer type to save
   */
  void save(TransferType transferType);

  /**
   * Save all transfer types to the cache.
   *
   * @param transferTypes the list of transfer types to save
   */
  void saveAll(List<TransferType> transferTypes);

  /**
   * Retrieve a transfer type from the cache by its ID.
   *
   * @param transferTypeId the ID of the transfer type
   * @return an Optional containing the TransferType if found
   */
  Optional<TransferType> findById(Integer transferTypeId);

  /**
   * Retrieve all transfer types from the cache.
   *
   * @return an Optional containing the list if cache is populated
   */
  Optional<List<TransferType>> findAll();

}
