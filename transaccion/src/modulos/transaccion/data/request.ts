import {
    IsUUID,
    IsInt,
    IsNumber,
    IsPositive,
    IsString,
    IsIn,
    IsNotEmpty,
  } from 'class-validator';
import { CrearTransaccionCommand } from '../command/crear-transaccion.command';
export class CrearTransaccionRequestDto{
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    readonly accountExternalIdDebit: string;
  
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    readonly accountExternalIdCredit: string;
  
    @IsInt()
    @IsPositive()
    @IsIn([1, 2, 3])
    @IsNotEmpty()
    readonly tranferTypeId: number;
  
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    readonly value: number;


    static limpiar(request:CrearTransaccionRequestDto):CrearTransaccionRequestDto{
        return {
            accountExternalIdCredit:request.accountExternalIdCredit,
            accountExternalIdDebit:request.accountExternalIdDebit,
            tranferTypeId:request.tranferTypeId,
            value:request.value
        }as CrearTransaccionRequestDto
    }

    static toCommand(request:CrearTransaccionRequestDto){
        return new CrearTransaccionCommand(
            request.accountExternalIdDebit,
            request.accountExternalIdCredit,
            request.tranferTypeId,
            request.value
        )
    }
}

export class ActuallizarTransaccionRequestDto{
    @IsString()
    @IsNotEmpty()
    readonly id: number;
  
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    readonly estado: string;
}