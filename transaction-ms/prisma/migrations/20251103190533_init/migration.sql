-- CreateIndex
CREATE INDEX "Transaction_accountExternalIdDebit_idx" ON "Transaction"("accountExternalIdDebit");

-- CreateIndex
CREATE INDEX "Transaction_accountExternalIdCredit_idx" ON "Transaction"("accountExternalIdCredit");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");
