package yape.challenge.transaction_service.adapters.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NamedObject(@JsonProperty("name") String name) {}