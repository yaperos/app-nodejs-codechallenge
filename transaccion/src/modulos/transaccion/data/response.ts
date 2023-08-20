import { ApiProperty } from "@nestjs/swagger";

export class CrearTransaccionResponse {

    @ApiProperty({
      type: 'string',
      example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
      description: 'account external debit id',
      required: true,
    })
    accountExternalIdDebit: string;
  
    @ApiProperty({
      type: 'string',
      example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
      description: 'account external credit id',
      required: true,
    })
    accountExternalIdCredit: string;
  
    @ApiProperty({
      type: 'number',
      example: '1',
      description: 'trander type id',
      required: true,
    })
    tranferTypeId: number;
  
    @ApiProperty({
      type: 'number',
      example: '1',
      description: 'amount of transaction',
      required: true,
    })
    value: number;


    static fromPostgre(): CrearTransaccionResponse {
        return {
            accountExternalIdCredit:"",
            accountExternalIdDebit:"",
            tranferTypeId:12,
            value:1
        } as CrearTransaccionResponse
    }
  }
  