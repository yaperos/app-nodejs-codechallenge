
// Injection token for the Kafka client
export const TRANSACTION_SERVICE_KAFKA_CLIENT = 'TRANSACTION_SERVICE_KAFKA_CLIENT';

// Kafka Topics
export const KAFKA_TOPIC_TRANSACTION_CREATED = 'transaction_created';
// Topic where anti-fraud *would* publish results (we simulate consumption)
// In a real scenario, the anti-fraud service listens to 'transaction_created'
// and publishes results to 'transaction_validated'. Our service listens to 'transaction_validated'.
// For this example, we'll use the same consumer to *process* the 'transaction_created' event directly.
export const KAFKA_TOPIC_TRANSACTION_VALIDATED = 'transaction_validated'; // We won't publish here in this example