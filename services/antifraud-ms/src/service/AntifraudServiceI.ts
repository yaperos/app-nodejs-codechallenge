import { Antifraud } from "../domain/Antifraud";

export interface AntifraudServiceI {
  processVerifyTransaction(transaction: Antifraud): Promise<Antifraud>;
}
