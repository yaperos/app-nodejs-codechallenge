import { Module } from '@nestjs/common'
import { TransactionApiModule } from './transaction/api_module'

@Module({
    imports: [TransactionApiModule],
    providers: [],
})
export class AppModule {}
