import {registerEnumType} from '@nestjs/graphql';

export enum MessageStatusEnum {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

registerEnumType(MessageStatusEnum, {
  name: 'MessageStatusEnum',
});