import { notifyKafka } from "../useCases/notifyKafka";
import { AfterTransactionExternalCreated } from "./AfterTransacionExternalCreated";

// Subscribers
new AfterTransactionExternalCreated(notifyKafka);
