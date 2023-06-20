import env from "../config/env/env";
import Logger from "../config/logger/winston";
import loadConsumer from "./queue/events/route";

export default async function initialize() {
    Logger.info(`Starting ${env.App.Name}`)
    //Load queue
    loadConsumer();
}

