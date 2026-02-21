package com.yape.antifraud.serializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;

import java.io.IOException;

public class JacksonDeserializer<T> implements Deserializer<T> {

    private final Class<T> targetType;
    private final ObjectMapper objectMapper;

    public JacksonDeserializer(Class<T> targetType, ObjectMapper objectMapper) {
        this.targetType = targetType;
        this.objectMapper = objectMapper;
    }

    @Override
    public T deserialize(String topic, byte[] data) {
        if (data == null) return null;
        try {
            return objectMapper.readValue(data, targetType);
        } catch (IOException e) {
            throw new SerializationException(
                    "Error deserializing JSON to " + targetType.getSimpleName()
                            + " for topic: " + topic, e);
        }
    }
}
