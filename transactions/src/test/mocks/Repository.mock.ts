export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: []
  },
  save: (x) => {
    return x;
  }
}));