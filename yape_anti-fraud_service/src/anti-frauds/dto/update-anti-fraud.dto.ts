import { PartialType } from '@nestjs/mapped-types';
import { CreateAntiFraudDto } from './create-anti-fraud.dto';

export class UpdateAntiFraudDto extends PartialType(CreateAntiFraudDto) {}
