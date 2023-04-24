import { Module } from "@nestjs/common";
import { TransactionResolve } from "./transaction.resolver";
import { TransactionModule } from "@transaction/transaction.module";

@Module({
    imports:[TransactionModule],
    providers:[TransactionResolve],
})

export class ResolverModule {}