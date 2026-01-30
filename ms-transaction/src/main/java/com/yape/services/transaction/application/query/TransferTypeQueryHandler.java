package com.yape.services.transaction.application.query;

import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.domain.repository.TransferTypeRepository;
import com.yape.services.transaction.domain.service.TransferTypeCacheService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;
import java.util.Optional;
import org.jboss.logging.Logger;

/**
 * Query handler for transfer type related operations.
 * Implements cache-aside pattern for improved performance.
 */
@ApplicationScoped
public class TransferTypeQueryHandler {

  private static final Logger LOGGER = Logger.getLogger(TransferTypeQueryHandler.class);

  private final TransferTypeRepository transferTypeRepository;
  private final TransferTypeCacheService cacheService;

  /**
   * Constructor for TransferTypeQueryHandler.
   *
   * @param transferTypeRepository the repository for transfer type data
   * @param cacheService           the cache service for transfer types
   */
  @Inject
  public TransferTypeQueryHandler(TransferTypeRepository transferTypeRepository,
                                  TransferTypeCacheService cacheService) {
    this.transferTypeRepository = transferTypeRepository;
    this.cacheService = cacheService;
  }

  /**
   * Retrieves a transfer type by its ID using cache-aside pattern.
   * First checks cache, if miss reads from DB and populates cache.
   *
   * @param transferTypeId the ID of the transfer type
   * @return an Optional containing the transfer type, or empty if not found
   */
  public Optional<TransferType> getTransferTypeById(Integer transferTypeId) {
    LOGGER.infof("Fetching transfer type with ID: %s", transferTypeId);

    Optional<TransferType> cachedTransferType = cacheService.findById(transferTypeId);
    if (cachedTransferType.isPresent()) {
      return cachedTransferType;
    }

    LOGGER.info("Reading from database and caching");
    Optional<TransferType> transferType = transferTypeRepository.findById(transferTypeId);
    transferType.ifPresent(cacheService::save);
    return transferType;
  }

  /**
   * Retrieves all transfer types using cache-aside pattern.
   * First checks cache, if miss reads from DB and populates cache.
   *
   * @return list of all transfer types
   */
  public List<TransferType> getAll() {
    LOGGER.info("Fetching all transfer types");

    return cacheService.findAll()
        .orElseGet(() -> {
          LOGGER.info("Reading all from database and caching");
          List<TransferType> transferTypes = transferTypeRepository.findAll();
          cacheService.saveAll(transferTypes);
          return transferTypes;
        });
  }

}
