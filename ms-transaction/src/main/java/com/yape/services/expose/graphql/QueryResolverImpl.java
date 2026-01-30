package com.yape.services.expose.graphql;

import com.yape.services.transaction.application.usecase.GetTransactionUseCase;
import com.yape.services.transaction.application.usecase.GetTransferTypesUseCase;
import com.yape.services.transaction.graphql.api.QueryResolver;
import com.yape.services.transaction.graphql.model.Transaction;
import com.yape.services.transaction.graphql.model.TransferType;
import jakarta.inject.Inject;
import java.util.List;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

/**
 * GraphQL resolver for transaction-related queries.
 */
@GraphQLApi
public class QueryResolverImpl implements QueryResolver {

  private final GetTransferTypesUseCase getTransferTypesUseCase;
  private final GetTransactionUseCase getTransactionUseCase;

  /**
   * Constructor for TransactionQueryResolver.
   *
   * @param getTransferTypesUseCase the service handling transfer type logic
   * @param getTransactionUseCase the service handling transaction retrieval logic
   */
  @Inject
  public QueryResolverImpl(GetTransferTypesUseCase getTransferTypesUseCase,
                           GetTransactionUseCase getTransactionUseCase) {
    this.getTransferTypesUseCase = getTransferTypesUseCase;
    this.getTransactionUseCase = getTransactionUseCase;
  }

  @Query("transaction")
  @Override
  public Transaction transaction(@Name("transactionExternalId") String transactionExternalId) {
    return getTransactionUseCase.execute(transactionExternalId);
  }

  @Query("transferTypes")
  @Override
  public List<TransferType> transferTypes() {
    return getTransferTypesUseCase.execute();
  }

}
