import { HttpStatus } from "@nestjs/common";
import { MensajeMetaData, MetaData,TypeError } from "../app/modelos";
import { Builder } from 'builder-pattern';
import { YapeException } from "./yape.exception";

export const MENSAJE_SATISFACTORIO="transaccion Exitosa"
export const metaDataSatisfactorio=(idTransaccion:string,totalRecords?:number,totalNumberPages?:number)=>{
    return Builder<MetaData>()
        .idTransaccion(idTransaccion)
        .totalRegistros(totalRecords)
        .totalNumeroPaginas(totalNumberPages)
        .mensajes([
            Builder<MensajeMetaData>()
            .code(HttpStatus.OK)
            .type(TypeError.info)
            .message(MENSAJE_SATISFACTORIO)
            .build()
        ])
        .build();
}
export const metaDataValidacionError=(idTransaccion:string,menssages:MensajeMetaData[])=>{
    return new YapeException( HttpStatus.BAD_REQUEST,Builder<MetaData>()
        .idTransaccion(idTransaccion)
        .codigoRespuesta(HttpStatus.BAD_REQUEST.toString())
        .mensajes(menssages)
        .build());
}