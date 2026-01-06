package pe.com.yape.transaction.infraestructure.adapter.in.messaging.kafka.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransactionEvaluatedEventDto {
    private UUID transactionExternalId;
    private String status;
}
