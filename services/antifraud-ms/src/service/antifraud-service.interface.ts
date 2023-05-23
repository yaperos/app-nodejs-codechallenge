import { Antifraud } from "../domain/antifraud";

export interface AntifraudServiceI {
  processTransactionCreateEvent(request: Antifraud): Promise<Antifraud>;
}
