package pe.com.yape.antifraud.infraestructure.adapters.out.messaging.kafka.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransactionEvaluatedEventDto{
   private UUID transactionExternalId;
   private String status;
}