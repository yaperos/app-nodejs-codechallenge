const express = require("express");
const kafka = require('kafka-node');
const transactionController = require("../controllers/transactionController.js");

const router = express.Router();
const client = new kafka.KafkaClient({kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS});
const producer = new kafka.Producer(client);

console.log(`${typeof transactionController.createTransaction}`);

producer.on('ready', ()=> {
    router.route("/").post((req,res)=> transactionController.createTransaction(req,res,producer));
}); 

router.route("/").get(transactionController.getTransactions);
router.route("/:uuid").get(transactionController.getTransaction).delete(transactionController.deleteTransaction);

module.exports = router;