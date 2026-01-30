package com.yape.services.transaction.application.usecase;

import com.yape.services.transaction.application.mapper.TransferTypeMapper;
import com.yape.services.transaction.application.query.TransferTypeQueryHandler;
import com.yape.services.transaction.domain.model.TransferType;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import org.jboss.logging.Logger;

/**
 * Use case for retrieving transfer types.
 */
@ApplicationScoped
public class GetTransferTypesUseCase {

  private static final Logger LOGGER = Logger.getLogger(GetTransferTypesUseCase.class);

  private final TransferTypeQueryHandler transferTypeQueryHandler;
  private final TransferTypeMapper transferTypeMapper;

  /**
   * Constructor for GetTransferTypesUseCase.
   *
   * @param transferTypeQueryHandler the query handler for transfer types
   * @param transferTypeMapper       the mapper for transfer types
   */
  public GetTransferTypesUseCase(TransferTypeQueryHandler transferTypeQueryHandler,
                                 TransferTypeMapper transferTypeMapper) {
    this.transferTypeQueryHandler = transferTypeQueryHandler;
    this.transferTypeMapper = transferTypeMapper;
  }

  /**
   * Executes the use case to retrieve transfer types.
   *
   * @return a list of transfer types
   */
  public List<com.yape.services.transaction.graphql.model.TransferType> execute() {
    LOGGER.info("Executing GetTransferTypesUseCase");
    List<TransferType> transferTypes = transferTypeQueryHandler.getAll();

    return transferTypes.stream()
        .map(transferTypeMapper::toGraphqlModel)
        .toList();
  }

}
