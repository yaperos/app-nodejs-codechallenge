import React from "react";
import { PermissionTable } from "../moleculas";
import { ITransaction } from "../../types/transaction/Transaction";

type TableComponentProps = {
  transaction: ITransaction | undefined;
};

const TableComponent: React.FC<TableComponentProps> = ({ transaction }) => {
  return <PermissionTable transaction={transaction} />;
};

export default TableComponent;
