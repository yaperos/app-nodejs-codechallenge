import { IResolvers } from "@graphql-tools/utils";
import _ from "lodash";

import { Service } from "../../service";

const service = new Service();

const mutation: IResolvers = {
  Mutation: {
    async createTransaction(__: void, { tran }): Promise<any> {
      return await service.createTransaction(tran);
    },
    async updateTransaction(__: void, { tran }): Promise<any> {
      return await service.updateTransaction(tran)
    },
  },
};

export default mutation;
