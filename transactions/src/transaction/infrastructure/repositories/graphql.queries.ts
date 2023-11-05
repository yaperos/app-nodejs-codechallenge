export const queryGetOne = (id: number) => {
  return `
    query {
      transaction(id: ${id}) {
        id
        status
        accountExternalIdDebit
        accountExternalIdCredit
        tranferTypeId
        value
        createdAt
      }
    }
  `;
};

export const mutationCreate = () => {
  return `
    mutation ($accountExternalIdDebit: String!, $accountExternalIdCredit: String!, $tranferTypeId: Int!, $value: Float!) {
    createTransaction(input: {
        accountExternalIdDebit: $accountExternalIdDebit,
        accountExternalIdCredit: $accountExternalIdCredit,
        tranferTypeId: $tranferTypeId,
        value: $value
    }) {
        id
        status
        accountExternalIdDebit
        accountExternalIdCredit
        tranferTypeId
        value
        createdAt
    }
    }
`;
};

export const mutationApproved = () => {
  return `
      mutation ($id: Int!) {
        approveTransaction(id: $id) {
          id
          status
          accountExternalIdDebit
          accountExternalIdCredit
          tranferTypeId
          value
          createdAt
      }
    }
  `;
};
export const mutationRejected = () => {
  return `
      mutation ($id: Int!) {
        rejectTransaction(id: $id) {
          id
          status
          accountExternalIdDebit
          accountExternalIdCredit
          tranferTypeId
          value
          createdAt
      }
    }
  `;
};
