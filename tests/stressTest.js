import http from "k6/http";

export const options = {
  stages: [
    { duration: "15s", target: 30000 }, //move from 1 to 3000 requests over 5s
  ],
};

export default function () {
  const url = "http://172.25.0.8:8080/graphql";
  const payload = JSON.stringify({
    query:
      "\n\nmutation CreateTransaction($data: CreateTransactionInput!) {\n  transaction(data: $data) {\n    transactionExternalId\n    transactionStatus {\n      name\n    }\n    transactionType {\n      name\n    }\n    value\n  }\n}\n\n",
    variables: {
      data: {
        value: 1,
        tranferTypeId: 1,
        accountExternalIdDebit: "some-guid",
        accountExternalIdCredit: "some-guid",
      },
    },
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = http.post(url, payload, params);
  console.log("res", res);
}
