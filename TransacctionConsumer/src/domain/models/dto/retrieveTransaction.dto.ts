/**
 * @author RRG
 */

import { ApiProperty } from "@nestjs/swagger";

export class RetrieveTransactionDto {

    @ApiProperty({ description : "transactionExternalId " , type : String })
    transactionExternalId : string;

    @ApiProperty({ description : "transactionType " , type : String })
    transactionType : {};
    
    @ApiProperty({ description : "transactionStatus " , type : String })
    transactionStatus : {};
    
    @ApiProperty({ description : "value " , type : Number })
    value : number;
    
    @ApiProperty({ description : "createdAt " , type : Number })
    createdAt : string;
}