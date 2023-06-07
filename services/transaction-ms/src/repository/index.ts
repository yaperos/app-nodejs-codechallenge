import { connect } from "couchbase";
import { configurationString } from "libs";
import { TransactionRepositoryImpl } from "./TransactionRepositoryImpl";

const cluster = connect(configurationString(process.env.COUCHBASE_CONN_STR), {
  username: configurationString(process.env.COUCHBASE_USERNAME),
  password: configurationString(process.env.COUCHBASE_PASSWORD),
});

export const transactionRepository = new TransactionRepositoryImpl({
  cluster,
  bucketName: configurationString(process.env.COUCHBASE_BUCKET_NAME),
});
