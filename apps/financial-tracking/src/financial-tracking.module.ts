import { Module } from '@nestjs/common';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { AccountModule } from './account/account.module';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';

@Module({
  imports: [PrismaModule, AccountModule, CustomerModule],
  controllers: [AccountController, CustomerController],
  providers: [AccountService, CustomerService],
})
export class FinancialTrackingModule {}
