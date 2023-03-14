import { PartialType } from '@nestjs/mapped-types';
import { CreateSecurityDto } from './create-security.dto';

export class UpdateSecurityDto extends PartialType(CreateSecurityDto) {}
