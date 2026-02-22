package com.yape.antifraud.infrastructure.config;

import com.yape.antifraud.domain.service.FraudEvaluationService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DomainConfig {

    @Bean
    public FraudEvaluationService fraudEvaluationService() {
        return new FraudEvaluationService();
    }
}
