import { antifraudService } from "../service";
import { AntifraudController } from "./AntifraudController";

export const controller = new AntifraudController({
  service: antifraudService,
});
