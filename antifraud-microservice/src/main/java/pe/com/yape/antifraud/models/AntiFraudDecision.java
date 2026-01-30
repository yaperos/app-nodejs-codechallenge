package pe.com.yape.antifraud.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AntiFraudDecision {

    private final boolean approved;

    public static AntiFraudDecision approved() {
        return new AntiFraudDecision(true);
    }

    public static AntiFraudDecision rejected() {
        return new AntiFraudDecision(false);
    }
}