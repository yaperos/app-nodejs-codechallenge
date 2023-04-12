import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsTypeValidConstraint implements ValidatorConstraintInterface {
    constructor() {}

    async validate(value: any, args: ValidationArguments) {
        return !(value != 1 && value != 2);
    }

    defaultMessage(args: ValidationArguments) {
        return `Tipo de Transação inválida, as transações disponiveis são: 1 - Credito e 2 - Debito`;
    }
}
