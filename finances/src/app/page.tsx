"use client";
import { io } from "socket.io-client";
import { SetStateAction, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 } from "uuid";

const apiUrl = "http://localhost:3001/graphql";

const graphql = JSON.stringify({
  query: `query ListTransactions($input: TransactionFiltersInput) {
            listTransactions(input: $input) {
              id
              status
              transferTypeId
              accountExternalIdDebit
              accountExternalIdCredit
              createdAt
              value
            }
          }
        `,
  variables: { input: {} },
});

const transferTypeEnum = {
  1: "1 - ALPHA",
  2: "2 - BETHA",
};

export default function Home() {
  const socket = io("http://localhost:3001");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [creditInput, setCreditInput] = useState("");
  const [debitInput, setDebitInput] = useState("");
  const [transferTypeId, setTransferTypeId] = useState(1);

  const setUUID = (accountIdType: string) => {
    if (accountIdType === "credit") setCreditInput(v4());
    if (accountIdType === "debit") setDebitInput(v4());
  };

  useEffect(() => {
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: graphql,
    })
      .then((resp) => resp.json())
      .then((data: any) => {
        setTransactions(data?.data?.listTransactions || []);
      });
  }, []);

  useEffect(() => {
    socket.on("updateTransaction", (message) => {
      const updatedTransaction = JSON.parse(message)
      const newTransactions = transactions.map((transaction: any) => {
        if (transaction.id === updatedTransaction.id) {
          transaction.status = updatedTransaction.status
          transaction.value = updatedTransaction.score
          return transaction
        } else {
          return transaction
        }
      })
      setTransactions(newTransactions)
    });
  }, [socket])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!creditInput || !debitInput) return

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation CreateTransaction($input: TransactionInput) {
          createTransaction(input: $input) {
            id
            status
            transferTypeId
            accountExternalIdDebit
            accountExternalIdCredit
            createdAt
            value
            }
          }`,
        variables: {
          input: {
            accountExternalIdDebit: creditInput,
            accountExternalIdCredit: debitInput ,
            transferTypeId
          }
        }
      }),
    })
    const newTransaction = await response.json()

    const createdTransaction = newTransaction.data.createTransaction

    setTransactions([
      createdTransaction,
      ...transactions
    ])

    setCreditInput("");
    setDebitInput("");
  };

  return (
    <div className="container mt-5">
      <h1>Transactions</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="accountExternalIdCreditInput" className="form-label">
            Account External Id Credit
          </label>
          <div className="input-group mb-3">
            <input
              id="accountExternalIdCreditInput"
              defaultValue={creditInput}
              type="text"
              className="form-control"
              placeholder="Account External Id Credit"
              aria-label="Account External Id Credit"
              aria-describedby="button-addon2"
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              onClick={() => {
                setUUID("credit");
              }}
            >
              Generate UUID
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="accountExternalIdDebitInput" className="form-label">
            Account External Id Debit
          </label>
          <div className="input-group mb-3">
            <input
              id="accountExternalIdDebitInput"
              defaultValue={debitInput}
              type="text"
              className="form-control"
              placeholder="Account External Id Debit"
              aria-label="Account External Id Debit"
              aria-describedby="button-addon2"
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              onClick={() => {
                setUUID("debit");
              }}
            >
              Generate UUID
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="transferTypeIdSelect" className="form-label">
            Transfer Type
          </label>
          <select
            id="transferTypeIdSelect"
            defaultValue={transferTypeId}
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => {
              setTransferTypeId(parseInt(e.target.value))
            }}
          >
            <option value={1}>1 - ALPHA</option>
            <option value={2}>2 - BETHA</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <table className="table table-striped-columns">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Account External Id Credit</th>
            <th scope="col">Account External Id Debit</th>
            <th scope="col">Status</th>
            <th scope="col">Transfer Type Id</th>
            <th scope="col">Value / Score</th>
            <th scope="col">Created At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: any) => {
            let classStatus = "";
            if (transaction.status === "approved")
              classStatus = "table-success";
            if (transaction.status === "rejected") classStatus = "table-danger";
            return (
              <tr key={transaction.id} className={classStatus}>
                <th scope="row">{transaction.id}</th>
                <td>{transaction.accountExternalIdCredit}</td>
                <td>{transaction.accountExternalIdDebit}</td>
                <td>{transaction.status}</td>
                <td>{transferTypeEnum[transaction.transferTypeId]}</td>
                <td>{transaction.value}</td>
                <td>{transaction.createdAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
