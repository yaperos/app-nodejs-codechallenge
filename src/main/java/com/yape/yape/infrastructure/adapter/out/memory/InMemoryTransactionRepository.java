//package com.yape.yape.infrastructure.adapter.out.memory;
//
//import com.yape.yape.domain.model.Transaction;
//import com.yape.yape.domain.port.TransactionRepositoryPort;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//import java.util.UUID;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Repository
//public class InMemoryTransactionRepository implements TransactionRepositoryPort {
//
//    private final ConcurrentHashMap<UUID, Transaction> store = new ConcurrentHashMap<>();
//
//    @Override
//    public Transaction save(Transaction transaction) {
//        store.put(transaction.getTransactionExternalId(), transaction);
//        System.out.println("SAVED: " + transaction.getTransactionExternalId());
//        return transaction;
//    }
//
//    @Override
//    public Optional<Transaction> findByExternalId(UUID externalId) {
//        System.out.println("FIND: " + externalId + " exists=" + store.containsKey(externalId));
//        return Optional.ofNullable(store.get(externalId));
//    }
//
//    @Override
//    public void deleteByExternalId(UUID externalId) {
//        store.remove(externalId);
//    }
//
//    @Override
//    public boolean existsByExternalId(UUID externalId) {
//        return store.containsKey(externalId);
//    }
//}
