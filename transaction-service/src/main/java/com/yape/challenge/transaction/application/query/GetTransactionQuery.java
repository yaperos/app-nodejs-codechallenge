package com.yape.challenge.transaction.application.query;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

/**
 * Query to get a transaction by external ID
 */
@Data
@Builder
public class GetTransactionQuery {
    private UUID externalId;
}

