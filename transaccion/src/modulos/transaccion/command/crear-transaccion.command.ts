import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CrearTransaccionResponse } from "../data/response";

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
    
    async execute(command: CrearTransaccionCommand): Promise<CrearTransaccionResponse> {
        return CrearTransaccionResponse.fromPostgre()
    }

}