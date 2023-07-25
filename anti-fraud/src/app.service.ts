import { Injectable } from '@nestjs/common';
import {
    ESTADOS_TRANSACCION,
    VALOR_MAXIMO_TRANSACCION
} from './support/domain.constant';

@Injectable()
export class AppService {
    validarTransaccion(datosTransaccion: any): object {
        const { value, transactionExternalId } = datosTransaccion;
        let status = ESTADOS_TRANSACCION.REJECTED;
        if (value <= VALOR_MAXIMO_TRANSACCION) {
            status = ESTADOS_TRANSACCION.APPROVED;
        }
        return {
            transactionExternalId,
            status
        }
    }
}