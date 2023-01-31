import { IResolvers } from "@graphql-tools/utils";
import { Service } from "../../service";

const service = new Service();

const query: IResolvers = {
  Query: {
    helloWorld(): any {
      return "Hello world!";
    },
    async getTransaction(__: void, { id }): Promise<any> {
      return await service.getTransaction(id);
    },
  },
};

export default query;
