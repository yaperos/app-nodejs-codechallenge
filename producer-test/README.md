# Kafka Producer Service in Go

This service is designed to send a high volume of test messages to a Kafka topic for the purpose of testing and evaluating the performance and scalability of microservices subscribed to the Kafka topic.

## Features

- Command-line interface to specify the number of messages to send.
- Randomized message payload generation to simulate real-world data.
- Connection to Kafka using the `confluent-kafka-go` library.

## Getting Started

### Prerequisites

- Go (version 1.15 or higher recommended)
- Access to a Kafka broker
