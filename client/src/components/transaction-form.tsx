import { ChangeEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Transaction } from "../types";
import "./transaction-form.css";

interface TransactionFormProps {
  onSuccess: (transaction: Transaction) => void;
}

const CREATE_TRANSACTION = gql`
  mutation Mutation($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      id
      transactionStatus {
        name
      }
      value
      createdAt
    }
  }
`;

function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [value, setValue] = useState<string>("0");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION);

  const submit = async () => {
    const { data, errors } = await createTransaction({
      variables: {
        data: {
          accountExternalIdDebit: "Guid",
          accountExternalIdCredit: "Guid",
          tranferTypeId: 1,
          value: Number(value),
        },
      },
    });

    if (errors) console.error(errors);
    else if (data) onSuccess(data.createTransaction);
  };

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 8) setValue(Number(e.target.value).toString());
  };

  const toggleEdditing = () => {
    setIsEditing(!isEditing);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center w-full mt-4">
        <div className="flex my-16">
          <div className="lds-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col justify-center items-center w-full mt-4">
      <div className="flex my-16">
        <p className="text-white text-sm mr-1">S/</p>
        {isEditing ? (
          <input
            type="number"
            value={value}
            className="text-xl text-white"
            onChange={handleChangeValue}
            onBlur={toggleEdditing}
          />
        ) : (
          <input
            type="text"
            className="text-xl text-white"
            value={Number(value).toFixed(2)}
            onFocus={toggleEdditing}
            readOnly
          />
        )}
      </div>

      <button
        className="yape-button rounded w-2/5 h-10 text-white"
        onClick={submit}
      >
        Yapear
      </button>
    </div>
  );
}

export default TransactionForm;
