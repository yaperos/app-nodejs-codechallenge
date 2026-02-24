package pe.yape.transactions.infrastructure.antifraud.dto;

public record AntifraudDecision(
        String status,
        Integer score
) {}