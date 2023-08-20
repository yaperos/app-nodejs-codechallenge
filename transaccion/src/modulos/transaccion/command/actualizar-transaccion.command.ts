import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { PrismaService } from "../../../app/baseDatos/prisma.service";
import { Prisma } from "@prisma/client";
import { TransactionEstado } from "../../../app/modelos";
  
export class ActualizarTransaccionCommand implements ICommand {
    constructor(
        public readonly id: number,
        public readonly estado: string,
    ) {}
}

@CommandHandler(ActualizarTransaccionCommand)
export class ActualizarTransaccionCommandHandler implements ICommandHandler<ActualizarTransaccionCommand,null>{
    
    constructor(
        private prisma: PrismaService,
    ){}
    async execute(command: ActualizarTransaccionCommand): Promise<null> {
        console.log("ActualizarTransaccionCommandHandler.execute",command)
        let prismaRequest:Prisma.TransaccionUpdateArgs={
            data:{estado:command.estado as TransactionEstado},
            where:{id:command.id}
        } 
        console.log("ActualizarTransaccionCommandHandler.execute.prismaRequest",prismaRequest)
        await this.prisma.transaccion.update(prismaRequest)
        return null
    }

}
 