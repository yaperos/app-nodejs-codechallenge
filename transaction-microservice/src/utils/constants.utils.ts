// Server

export const PORT = Bun.env.PORT ? parseInt(Bun.env.PORT) : 3000

// Kafka

export const KAFKA_CLIENT_ID = Bun.env.KAFKA_CLIENT_ID ?? 'transaction-microservice'

export const KAFKA_GROUP_ID = Bun.env.KAFKA_GROUP_ID ?? 'transaction-microservice-group'

export const KAFKA_BROKER = Bun.env.KAFKA_BROKER ?? 'localhost:9092'

export const KAFKA_TOPIC_TRANSACTION_CREATED = 'transaction-created'

export const KAFKA_TOPIC_TRANSACTION_UPDATED = 'transaction-updated'

// Business

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}
