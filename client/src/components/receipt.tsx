import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Transaction } from "../types";
import "./receipt.css";

interface ReceiptProps {
  transaction: Transaction;
}

function Receipt({ transaction }: ReceiptProps) {
  if (transaction.transactionStatus!.name === "pending")
    return (
      <div className="receipt receipt-border bg-white">
        <div className="flex flex-col p-4">
          <p className="text-lg font-semibold yape-text">
            Yape pendiente de aprobación
          </p>
          <div className="flex w-full justify-center my-10">
            <p className="text-lg font-semibold yape-text-op mr-1">S/</p>
            <p className="text-3xl font-semibold yape-text">
              {transaction.value}
            </p>
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="font-semibold text-black">
              {transaction.contact?.name}
            </p>
            <p className="text-sm font-normal text-gray-500">
              {format(new Date(transaction.createdAt!), "PPpp", { locale: es })}
            </p>
          </div>
        </div>
      </div>
    );

  if (transaction.transactionStatus!.name === "rejected")
    return (
      <div className="receipt receipt-border bg-white">
        <div className="flex flex-col p-4">
          <p className="text-lg font-semibold yape-text">
            Tu yapeo fue rechazado
          </p>
          <div className="flex w-full justify-center my-6">
            <p className="text-lg font-semibold yape-text-op mr-1">S/</p>
            <p className="text-3xl font-semibold yape-text">
              {transaction.value}
            </p>
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="font-semibold text-black">
              {transaction.contact?.name}
            </p>
            <p className="text-sm font-normal text-gray-500">
              {format(new Date(transaction.createdAt!), "PPpp", { locale: es })}
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="receipt receipt-border bg-white">
      <div className="flex flex-col p-4">
        <p className="text-lg font-semibold yape-text">¡Yapeaste!</p>
        <div className="flex w-full justify-center my-6">
          <p className="text-lg font-semibold yape-text-op mr-1">S/</p>
          <p className="text-3xl font-semibold yape-text">
            {transaction.value}
          </p>
        </div>
        <div className="flex flex-col w-full justify-center">
          <p className="font-semibold text-black">
            {transaction.contact?.name}
          </p>
          <p className="text-sm font-normal text-gray-500">
            {format(new Date(transaction.createdAt!), "PPpp", { locale: es })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
