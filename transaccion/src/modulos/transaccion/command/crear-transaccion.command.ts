import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CrearTransaccionResponse } from "../data/response";
import { PrismaService } from "../../../app/baseDatos/prisma.service";
import { Prisma } from "@prisma/client";

export class CrearTransaccionCommand implements ICommand {
    constructor(
      public readonly accountExternalIdDebit: string,
      public readonly accountExternalIdCredit: string,
      public readonly tranferTypeId: number,
      public readonly value: number,
    ) {}
}


@CommandHandler(CrearTransaccionCommand)
export class CrearTransaccionCommandHandler implements ICommandHandler<CrearTransaccionCommand,CrearTransaccionResponse>{
    constructor(private prisma: PrismaService){}
    async execute(command: CrearTransaccionCommand): Promise<CrearTransaccionResponse> {
        const prismaTransaccionInput:Prisma.TransaccionCreateInput={
            accountExternalIdDebit:command.accountExternalIdDebit,
            accountExternalIdCredit:command.accountExternalIdCredit,
            tranferTypeId:command.tranferTypeId,
            value:command.value
        }
        
        const primaResponse=await this.prisma.transaccion.create({data:prismaTransaccionInput})
        console.log("primaResponse",primaResponse)
        return CrearTransaccionResponse.fromPostgre()
    }

}