import http from "k6/http";

export const options = {
  stages: [
    { duration: "5s", target: 2 }, //move from 1 to 3000 requests over 5s
  ],
};

export default function () {
  const url = "http://172.25.0.8:8080/graphql";
  const payload = JSON.stringify(
    {"query":"query GetTransactions {\n  transactions {\n    transactionExternalId\n    value\n    transactionStatus {\n      name\n    }\n    transactionType {\n      name\n    }\n    createdAt\n  }\n}\n"}
  );

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = http.post(url, payload, params);
  console.log("res", res);
}
