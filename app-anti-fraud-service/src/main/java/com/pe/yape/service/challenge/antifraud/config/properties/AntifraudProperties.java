package com.pe.yape.service.challenge.antifraud.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "application.rules")

@Getter
@Setter
public class AntifraudProperties {

    private String amountLimit;

}
