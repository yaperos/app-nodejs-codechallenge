import { registerDecorator, ValidationOptions } from 'class-validator';
import { PrismaClient } from '.prisma/client/transaction';

const prisma = new PrismaClient();

export function IsValidTypeTransferId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidTypeTransferId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: number) {
          const result = await prisma.type.count({ where: { id: value } });
          return result !== 0;
        },
        defaultMessage() {
          return `$value, We still do not have this type of transfer in Yape.`;
        },
      },
    });
  };
}
