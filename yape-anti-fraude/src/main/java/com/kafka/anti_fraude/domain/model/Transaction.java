// package com.kafka.anti_fraude.domain.model;

// import java.time.Instant;
// import java.util.UUID;

// public record Transaction(
//         UUID transactionExternalId,
//         String accountExternalIdDebit,
//         String accountExternalIdCredit,
//         int tranferTypeId,
//         double value,
//         String transactionStatus,
//         Instant createdAt
// ) {
//     public Transaction(String accountExternalIdDebit, String accountExternalIdCredit, int tranferTypeId, double value) {
//         this(
//                 UUID.randomUUID(),
//                 accountExternalIdDebit,
//                 accountExternalIdCredit,
//                 tranferTypeId,
//                 value,
//                 "pending",
//                 Instant.now()
//         );
//     }

//     public Transaction updateStatus(String newStatus) {
//         return new Transaction(
//                 this.transactionExternalId(),
//                 this.accountExternalIdDebit(),
//                 this.accountExternalIdCredit(),
//                 this.tranferTypeId(),
//                 this.value(),
//                 newStatus,
//                 this.createdAt()
//         );
//     }
// }