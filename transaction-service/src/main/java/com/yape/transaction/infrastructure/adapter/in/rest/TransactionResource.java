package com.yape.transaction.infrastructure.adapter.in.rest;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.in.GetTransactionUseCase;
import com.yape.transaction.infrastructure.adapter.in.rest.dto.CreateTransactionRequest;
import com.yape.transaction.infrastructure.adapter.in.rest.dto.TransactionResponse;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.logging.Logger;

import java.util.Optional;
import java.util.UUID;

@Path("/transactions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Transaction", description = "Transaction management operations")
public class TransactionResource {

    private static final Logger LOG = Logger.getLogger(TransactionResource.class);

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;
    private final TransactionResponseMapper mapper;

    @Inject
    public TransactionResource(CreateTransactionUseCase createTransactionUseCase,
                               GetTransactionUseCase getTransactionUseCase,
                               TransactionResponseMapper mapper) {
        this.createTransactionUseCase = createTransactionUseCase;
        this.getTransactionUseCase = getTransactionUseCase;
        this.mapper = mapper;
    }

    @POST
    @Operation(summary = "Create a new transaction", 
               description = "Creates a new financial transaction with pending status")
    @APIResponses({
        @APIResponse(responseCode = "201", description = "Transaction created successfully",
                     content = @Content(schema = @Schema(implementation = TransactionResponse.class))),
        @APIResponse(responseCode = "400", description = "Invalid request data")
    })
    public Response createTransaction(@Valid CreateTransactionRequest request) {
        LOG.infof("Creating transaction: debit=%s, credit=%s, value=%s",
                request.getAccountExternalIdDebit(),
                request.getAccountExternalIdCredit(),
                request.getValue());

        Transaction transaction = createTransactionUseCase.createTransaction(
                request.getAccountExternalIdDebit(),
                request.getAccountExternalIdCredit(),
                request.getTranferTypeId(),
                request.getValue()
        );

        TransactionResponse response = mapper.toResponse(transaction);
        
        LOG.infof("Transaction created: %s", transaction.getTransactionExternalId());
        
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @GET
    @Path("/{transactionExternalId}")
    @Operation(summary = "Get transaction by ID", 
               description = "Retrieves a transaction by its external ID")
    @APIResponses({
        @APIResponse(responseCode = "200", description = "Transaction found",
                     content = @Content(schema = @Schema(implementation = TransactionResponse.class))),
        @APIResponse(responseCode = "404", description = "Transaction not found")
    })
    public Response getTransaction(
            @Parameter(description = "Transaction external ID", required = true)
            @PathParam("transactionExternalId") UUID transactionExternalId) {
        
        LOG.infof("Retrieving transaction: %s", transactionExternalId);

        Optional<Transaction> transactionOpt = getTransactionUseCase.getTransaction(transactionExternalId);

        if (transactionOpt.isEmpty()) {
            LOG.warnf("Transaction not found: %s", transactionExternalId);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Transaction not found"))
                    .build();
        }

        TransactionResponse response = mapper.toResponse(transactionOpt.get());
        return Response.ok(response).build();
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
