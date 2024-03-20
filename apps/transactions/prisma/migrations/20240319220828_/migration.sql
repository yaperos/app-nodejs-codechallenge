-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transaction_type_id_fkey" FOREIGN KEY ("transaction_type_id") REFERENCES "TransactionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
