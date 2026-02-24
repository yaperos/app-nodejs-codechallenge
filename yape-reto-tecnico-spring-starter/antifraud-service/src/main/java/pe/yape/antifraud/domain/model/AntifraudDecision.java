package pe.yape.antifraud.domain.model;

public record AntifraudDecision(DecisionStatus status, int score) {}