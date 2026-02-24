package pe.yape.antifraud.api.dto;

public record AntifraudValidateResponse(
        String status,
        int score
) {}