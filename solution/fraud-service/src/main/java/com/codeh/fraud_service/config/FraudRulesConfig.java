package com.codeh.fraud_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "fraud.rules")
public class FraudRulesConfig {
    private BigDecimal maxAmount;
}
