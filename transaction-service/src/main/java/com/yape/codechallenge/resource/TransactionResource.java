package com.yape.codechallenge.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.UUID;

import com.yape.codechallenge.enums.TransactionStatus;
import com.yape.codechallenge.enums.TransactionType;
import com.yape.codechallenge.model.Transaction;
import com.yape.codechallenge.request.CreateTransactionRequest;
import com.yape.codechallenge.response.TransactionResponse;
import com.yape.codechallenge.service.TransactionService;

@Path("/transactions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransactionResource {

    @Inject
    TransactionService transactionService;

    @POST
    public Response create(CreateTransactionRequest request) {
        Transaction transaction = transactionService.createTransaction(request);
        return Response.status(201).entity(toResponse(transaction)).build();
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") UUID id) {
        Transaction transaction = transactionService.getTransaction(id);
        if (transaction == null) {
            return Response.status(404).build();
        }
        return Response.ok(toResponse(transaction)).build();
    }

    private TransactionResponse toResponse(Transaction t) {
        return new TransactionResponse(
                t.transactionExternalId,
                TransactionType.TRANSFER,
                TransactionStatus.valueOf(t.status.toUpperCase()),
                t.value,
                t.createdAt);
    }
}
