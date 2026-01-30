package com.yape.services.expose.graphql;

import com.yape.services.shared.util.Constants;
import com.yape.services.transaction.application.dto.RequestMetaData;
import com.yape.services.transaction.application.usecase.CreateTransactionUseCase;
import com.yape.services.transaction.graphql.api.MutationResolver;
import com.yape.services.transaction.graphql.model.CreateTransaction;
import com.yape.services.transaction.graphql.model.Transaction;
import io.quarkus.vertx.http.runtime.CurrentVertxRequest;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;

/**
 * GraphQL resolver for transaction-related operations.
 */
@GraphQLApi
public class MutationResolverImpl implements MutationResolver {

  private final CreateTransactionUseCase createTransactionUseCase;
  private final CurrentVertxRequest currentVertxRequest;

  /**
   * Constructor for TransactionResolver.
   *
   * @param createTransactionUseCase the service handling transaction logic
   * @param currentVertxRequest      the current Vert.x request context
   */
  @Inject
  public MutationResolverImpl(CreateTransactionUseCase createTransactionUseCase,
                              CurrentVertxRequest currentVertxRequest) {
    this.createTransactionUseCase = createTransactionUseCase;
    this.currentVertxRequest = currentVertxRequest;
  }

  /**
   * Creates a new transaction.
   *
   * @param input the input data for creating a transaction
   * @return the created transaction details
   */
  @Mutation("createTransaction")
  @Override
  public Transaction createTransaction(@NotNull CreateTransaction input) {
    var req = currentVertxRequest.getCurrent().request();

    String authHeader = req.getHeader("Authorization");
    String requestId  = req.getHeader(Constants.REQUEST_ID);
    String requestDate = req.getHeader(Constants.REQUEST_DATE);

    RequestMetaData metadata = new RequestMetaData(authHeader, requestId, requestDate);
    return createTransactionUseCase.execute(input, metadata);
  }

}
