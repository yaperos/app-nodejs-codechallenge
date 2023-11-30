import { Resolver, Query } from '@nestjs/graphql';
import { AntifraudService } from './anti-fraud.service';
import { Antifraud } from './entities/antifraud.entity';

@Resolver(() => Antifraud)
export class AntifraudResolver {
  constructor(private readonly antifraudService: AntifraudService) {}
  @Query(() => String)
  async testing() {
    await this.antifraudService.testEmit();
    return 'ewqe';
  }
}
