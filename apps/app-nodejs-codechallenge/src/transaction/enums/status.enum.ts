export enum StatusEnum {
  PENDING,
  APPROVED,
  REJECT,
}

const getStatusName = (status: StatusEnum): string => {
  switch (status) {
    case StatusEnum.PENDING:
      return "PENDING";
    case StatusEnum.APPROVED:
      return "APPROVED";
    case StatusEnum.REJECT:
      return "REJECT";
  }
};

export default getStatusName;
