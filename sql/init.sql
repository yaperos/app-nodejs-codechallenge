CREATE USER postgres;
CREATE DATABASE postgres;
GRANT ALL PRIVILEGES ON DATABASE db TO docker;

CREATE TABLE IF NOT EXISTS transactions (
  id INT NOT NULL ,
  account_external_id_debit varchar(250) NOT NULL,
  account_external_id_credit varchar(250) NOT NULL,
  transfer_type_id INT NOT NULL,
  value double precision NOT NULL,
  transaction_status varchar(250) NULL,
  transaction_type varchar(250)  NULL,
  createdAt timetz  NULL,
  PRIMARY KEY (id)
);
  
  

   
