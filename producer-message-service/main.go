package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/IBM/sarama"
)

func main() {
	config := sarama.NewConfig()
	config.Producer.Return.Successes = true

	producer, err := sarama.NewSyncProducer([]string{"localhost:9092"}, config)
	if err != nil {
		log.Fatal("Failed to start Sarama producer:", err)
	}
	defer producer.Close()

	http.HandleFunc("/send", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		var msg map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
			http.Error(w, "Error decoding request body", http.StatusBadRequest)
			return
		}

		jsonData, err := json.Marshal(msg)
		if err != nil {
			http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
			return
		}

		producerMessage := &sarama.ProducerMessage{
			Topic: "transactions",
			Value: sarama.ByteEncoder(jsonData),
		}

		_, _, err = producer.SendMessage(producerMessage)
		if err != nil {
			http.Error(w, "Error sending message to Kafka", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Message sent to Kafka successfully"))
	})

	log.Println("Server started, listening on port 4005")
	if err := http.ListenAndServe(":4005", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
