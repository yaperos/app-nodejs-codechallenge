package com.yape.services.transaction.application.dto;

/**
 * Data transfer object for request metadata.
 */
public record RequestMetaData(
    String authorization,
    String requestId,
    String requestDate
) {
}
