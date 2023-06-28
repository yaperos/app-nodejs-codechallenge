CREATE DATABASE yape_challenge;
USE yape_challenge;
CREATE TABLE `transactions` (
  `transactionExternalId` varchar(36) NOT NULL,
  `accountExternalIdDebit` text NOT NULL,
  `accountExternalIdCredit` text NOT NULL,
  `tranferTypeId` int(11) NOT NULL,
  `transactionStatus` text NOT NULL,
  `value` float NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`transactionExternalId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;