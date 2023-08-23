import React from "react";
import HeaderComponent from "../components/organismos/HeaderComponents";
import { Box } from "@mui/material";
import TableComponent from "../components/organismos/TableComponent";
import useTransactionContainer from "./useHooks/useTransactionContainer";
import FormComponents from "../components/organismos/FormComponents";

const PermissionContainer: React.FC = () => {
  const {
    transaction,
    transactionExternalId,
    setTransactionExternalId,
    isLoading,
    isLoadingSearch,
    createTransaction,
    searchTransaction,
    value,
    setValue,
  } = useTransactionContainer();

  return (
    <Box paddingY={5} paddingX={"10%"}>
      <HeaderComponent />
      <FormComponents
        transactionExternalId={transactionExternalId}
        setTransactionExternalId={setTransactionExternalId}
        value={value}
        setValue={setValue}
        isLoading={isLoading}
        isLoadingSearch={isLoadingSearch}
        handlerButtonForm={createTransaction}
        handlerButtonSearchForm={searchTransaction}
        buttonLabel="Generate Transaction"
      />
      <TableComponent transaction={transaction} />
    </Box>
  );
};

export default PermissionContainer;
