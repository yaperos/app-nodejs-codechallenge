.PHONY: tr
tr:
	@echo "Running transaction"
	nest start transaction --watch

.PHONY: af
af:
	@echo "Running anti-fraud"
	nest start anti-fraud --watch
