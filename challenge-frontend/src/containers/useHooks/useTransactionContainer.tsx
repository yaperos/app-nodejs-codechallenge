import { useEffect, useState } from "react";
import { TransactionServices } from "../../services/transaction/TransactionServices";
import {
  ITransaction,
  ITransactionBody,
} from "../../types/transaction/Transaction";

const useTransactionContainer = () => {
  const [transaction, setTransaction] = useState<ITransaction>();
  const [transactionExternalId, setTransactionExternalId] = useState("");
  const [value, setValue] = useState<string>("100");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isLoadingSearch, setIsloadingSearch] = useState<boolean>(false);

  const permissionServices = new TransactionServices();

  const createTransaction = async () => {
    setTransactionExternalId("");
    setTransaction(undefined);
    setIsloading(true);
    const body: ITransactionBody = {
      accountExternalIdDebit: "f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5",
      accountExternalIdCredit: "f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5",
      transferTypeId: 2,
      value,
    };
    const result = await permissionServices.createTransaction(body);
    setTimeout(() => {
      setTransactionExternalId(result.transactionExternalId);
      setIsloading(false);
    }, 1000);
  };

  const searchTransaction = async (): Promise<void> => {
    setIsloadingSearch(true);
    const result = await permissionServices.getById(transactionExternalId);
    setTimeout(() => {
      setTransaction(result);
      setIsloadingSearch(false);
    }, 1000);
  };

  return {
    transaction,
    transactionExternalId,
    setTransactionExternalId,
    isLoading,
    isLoadingSearch,
    createTransaction,
    searchTransaction,
    value,
    setValue,
  };
};
export default useTransactionContainer;
