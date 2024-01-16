package main

import (
	"encoding/json"
	"flag"
	"math"
	"math/rand"
	"time"

	"github.com/IBM/sarama"
	"github.com/google/uuid"
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

	config := sarama.NewConfig()
	config.Producer.Return.Successes = true

	producer, err := sarama.NewSyncProducer([]string{"localhost:9092"}, config)
	if err != nil {
		panic(err)
	}
	defer producer.Close()

	topic := "transactions"

	for i := 0; i < numMessages; i++ {
		msg := generateRandomMessage()
		jsonData, _ := json.Marshal(msg)

		producerMessage := &sarama.ProducerMessage{
			Topic: topic,
			Value: sarama.ByteEncoder(jsonData),
		}

		_, _, err := producer.SendMessage(producerMessage)
		if err != nil {
			panic(err)
		}
	}
}

func generateRandomMessage() KafkaMessage {
	rand.Seed(time.Now().UnixNano())
	return KafkaMessage{
		AccountExternalIdDebit:  uuid.New().String(),
		AccountExternalIdCredit: uuid.New().String(),
		TransferTypeId:          rand.Intn(5) + 1,
		Value:                   math.Round(rand.Float64()*2000*100) / 100,
	}
}
