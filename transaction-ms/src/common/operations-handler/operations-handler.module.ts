import { Global, Module } from '@nestjs/common';
import { OperationHandlerService } from './operations-handler.service';

@Global()
@Module({
    providers: [OperationHandlerService],
    exports: [OperationHandlerService],
})
export class OperationsHandlerModule {}
