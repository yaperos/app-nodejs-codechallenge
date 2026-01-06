package pe.com.yape.antifraud.infraestructure.adapters.in.messaging.kafka.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransactionEventDto {

    private UUID transactionExternalId;
    private BigDecimal amount;
}
