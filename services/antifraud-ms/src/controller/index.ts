import { service } from "../service/index";
import { AntifraudController } from "./antifraud-controller";

export const controller = new AntifraudController({
  service: service,
});
