package com.kafka.anti_fraude.infrastructure.messaging.config;

import static org.junit.jupiter.api.Assertions.assertFalse;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

class JacksonConfigTest {

    private final JacksonConfig config = new JacksonConfig();

    @Test
    void objectMapper_shouldDisableWriteDatesAsTimestamps() {
        ObjectMapper mapper = config.objectMapper();

        // Forma confiable de verificar SerializationFeature
        boolean writeDatesAsTimestamps = mapper.getSerializationConfig()
                .isEnabled(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        assertFalse(writeDatesAsTimestamps, "WRITE_DATES_AS_TIMESTAMPS debe estar deshabilitado");
    }
}