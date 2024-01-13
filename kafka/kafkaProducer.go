package main

import (
	"encoding/json"
	"flag"
	"math/rand"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type KafkaMessage struct {
	AccountExternalIdDebit  string  `json:"accountExternalIdDebit"`
	AccountExternalIdCredit string  `json:"accountExternalIdCredit"`
	TransferTypeId          int     `json:"transferTypeId"`
	Value                   float64 `json:"value"`
}

func main() {
	var numMessages int
	flag.IntVar(&numMessages, "n", 1000, "Number of messages to produce")
	flag.Parse()

	producer, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "localhost"})
	if err != nil {
		panic(err)
	}
	defer producer.Close()

	topic := "transactions"

	for i := 0; i < numMessages; i++ {
		msg := generateRandomMessage()
		jsonData, _ := json.Marshal(msg)
		producer.Produce(&kafka.Message{
			TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
			Value:          jsonData,
		}, nil)
	}

	producer.Flush(15 * 1000)
}

func generateRandomMessage() KafkaMessage {
	return KafkaMessage{
		AccountExternalIdDebit:  randomString(),
		AccountExternalIdCredit: randomString(),
		TransferTypeId:          rand.Intn(10),
		Value:                   rand.Float64() * 1000,
	}
}

func randomString() string {
	rand.Seed(time.Now().UnixNano())
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	s := make([]rune, 10)
	for i := range s {
		s[i] = letters[rand.Intn(len(letters))]
	}
	return string(s)
}
