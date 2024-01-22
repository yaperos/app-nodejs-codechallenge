.PHONY: tr
tr:
	@echo "Running transaction"
	nest start transaction --watch

.PHONY: af
af:
	@echo "Running anti-fraud"
	nest start anti-fraud --watch

.PHONY: run-transaction
run-transaction:
	@echo "Running transaction"
	nest build transaction
	npm run typeorm:run
	npm run start transaction

.PHONY: run-anti-fraud
run-anti-fraud:
	@echo "Running anti-fraud"
	nest build anti-fraud
	npm run start anti-fraud
