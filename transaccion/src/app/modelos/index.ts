import { HttpStatus } from "@nestjs/common/enums";

export interface MetaData{
    mensajes?:MensajeMetaData[],
    totalRegistros?:number
    idTransaccion?:string
    NumeroPaginaSiguiente?:number
    totalNumeroPaginas?:number
    informacionAdicional?:string
    codigoRespuesta?:string
}
export interface MensajeMetaData{
    code:HttpStatus | string
    type:TypeError
    message:string|any
}
export enum TypeError{
    error="error", warn="warn", invalid="invalid", fatal="fatal", info="info"
}
export enum TransactionEstado {
    PENDIENTE = 'PENDIENTE',
    APROVADO = 'APROVADO',
    RECHAZADO = 'RECHAZADO',    
}