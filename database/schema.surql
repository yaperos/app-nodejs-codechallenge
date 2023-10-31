-- ------------------------------
-- TABLE: transaction
-- ------------------------------

DEFINE TABLE transaction SCHEMAFULL PERMISSIONS NONE;

DEFINE FIELD value ON transaction TYPE number;
DEFINE FIELD externalId ON transaction TYPE string;
DEFINE FIELD accountExternalIdDebit ON transaction TYPE string;
DEFINE FIELD accountExternalIdCredit ON transaction TYPE string;
DEFINE FIELD transactionType ON transaction TYPE record<transaction_type>;
DEFINE FIELD status ON transaction TYPE string;

DEFINE FIELD annotations ON transaction TYPE option<string>;

DEFINE FIELD createdAt ON transaction TYPE datetime DEFAULT time::now()
VALUE $before OR time::now();
DEFINE FIELD updatedAt ON transaction TYPE datetime DEFAULT time::now() VALUE time::now();

DEFINE INDEX transactionExternalIdIndex ON TABLE transaction COLUMNS externalId;


-- ------------------------------
-- TABLE: transaction_type
-- ------------------------------

DEFINE TABLE transaction_type SCHEMAFULL PERMISSIONS NONE;

DEFINE FIELD name ON transaction_type TYPE string;

DEFINE FIELD createdAt ON transaction_type TYPE datetime DEFAULT time::now()
VALUE $before OR time::now();
DEFINE FIELD updatedAt ON transaction_type TYPE datetime DEFAULT time::now() VALUE time::now();


UPDATE transaction_type:1 MERGE {
  name: 'Bank'
};

UPDATE transaction_type:2 MERGE {
  name: 'InterBank'
};

UPDATE transaction_type:3 MERGE {
  name: 'Credit'
};

UPDATE transaction_type:4 MERGE {
  name: 'Debit'
};