import { Inject, Injectable, Logger } from "@nestjs/common";
import { map, tap } from "rxjs";
import { CreateTransactionCommand } from "../domain/create-transaction.command";
import { ANTI_FRAUD_SERVICE_PORT_TOKEN, AntiFraudServicePort } from "../domain/anti-fraud-service.port";
import { CREATE_TRANSACTION_PORT_TOKEN, CreateTransactionPort } from "../domain/create-transaction.port";
import { GetTransactionCommand } from "../domain/get-transaction.command";
import { GET_TRANSACTION_PORT_TOKEN, GetTransactionPort } from "../domain/get-transaction.port";

@Injectable()
export class TransactionCrudService {

    private logger = new Logger(TransactionCrudService.name);

    constructor(
        @Inject(ANTI_FRAUD_SERVICE_PORT_TOKEN) private readonly antiFraudServicePort: AntiFraudServicePort,
        @Inject(CREATE_TRANSACTION_PORT_TOKEN) private readonly createTransactionPort: CreateTransactionPort,
        @Inject(GET_TRANSACTION_PORT_TOKEN) private readonly getTransactionPort: GetTransactionPort
    ) { }


    /**
     * Metodo que crea una transaccion a traves del puerto
     * @param command datos de la transaccion
     * @returns uuid de la transaccion creada
     */
    createTransaction(command: CreateTransactionCommand) {
        this.logger.debug(`creating transaction with params ${JSON.stringify(command)}`)
        return this.createTransactionPort.createTransaction(command.transactionData).pipe(
            tap(transactionId => {
                command.transactionData.transactionId = transactionId;
                this.logger.debug('triggering anti-fraud service');
                this.antiFraudServicePort.triggerAntiFraudService(command);
            })
        )
    }

    /**
     * Metodo que consulta una transaccion por su uuid a traves del puerto
     * @param command uuid de la tx
     * @returns datos de la trasaccion a consultar o nulo en caso de que no exista
     */
    findTransactionById(command: GetTransactionCommand) {
        return this.getTransactionPort.findTransactionById(command).pipe(
            map(result => JSON.stringify(result))
        );
    }
}