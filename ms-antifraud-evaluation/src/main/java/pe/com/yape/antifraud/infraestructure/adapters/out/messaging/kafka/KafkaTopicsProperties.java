package pe.com.yape.antifraud.infraestructure.adapters.out.messaging.kafka;


public class KafkaTopicsProperties {

    private KafkaTopicsProperties() {

    }

    public static final String TRANSACTION_APPROVED = "transaction.approved";
    public static final String TRANSACTION_REJECTED = "transaction.rejected";
}
