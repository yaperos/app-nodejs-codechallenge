export const enum StatusType {
  pending = 1,
  approved = 2,
  rejected = 3,
}

export const StatusTypeLabels = {
  [StatusType.pending]: 'pending',
  [StatusType.approved]: 'approved',
  [StatusType.rejected]: 'rejected',
};
