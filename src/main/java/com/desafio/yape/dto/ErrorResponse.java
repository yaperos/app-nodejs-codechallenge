package com.desafio.yape.dto;

public class ErrorResponse {
    private String message;
    private String externalId;

    public ErrorResponse() {
    }

    public ErrorResponse(String message, String externalId) {
        this.message = message;
        this.externalId = externalId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }
}
