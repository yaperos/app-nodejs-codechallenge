import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";

export class CrearTransaccionResponse {

    @ApiProperty({
      type: 'string',
      example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
      description: 'id de la cuenta externa de debito',
      required: true,
    })
    accountExternalIdDebit: string;
  
    @ApiProperty({
      type: 'string',
      example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
      description: 'id de la cuenta externa de credito',
      required: true,
    })
    accountExternalIdCredit: string;
  
    @ApiProperty({
      type: 'number',
      example: '1',
      description: 'id tipo de transferencia',
      required: true,
    })
    tranferTypeId: number;
  
    @ApiProperty({
      type: 'number',
      example: '1',
      description: 'monto de la transaccion',
      required: true,
    })
    value: number;

    @ApiProperty({
      type: 'string',
      example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
      description: 'estado de la transaccion',
      required: true,
    })
    estado: string;

    @ApiProperty({
      type: 'number',
      example: '1',
      description: 'id de la transaccion',
      required: true,
    })
    id: number;


    static desdePostgre(primaResponse:{
      id: number;
      accountExternalIdDebit: string;
      accountExternalIdCredit: string;
      tranferTypeId: number;
      value: number;
      estado: $Enums.TransaccionEstado;
  }): CrearTransaccionResponse {
        return {
            accountExternalIdCredit:primaResponse.accountExternalIdCredit,
            accountExternalIdDebit:primaResponse.accountExternalIdDebit,
            tranferTypeId:primaResponse.tranferTypeId,
            value:primaResponse.value,
            estado:primaResponse.estado,
            id:primaResponse.id
        } as CrearTransaccionResponse
    }
  }
  