import {MessageStatusModel} from "../Models/MessageStatusModel";

export interface EventPublishInterface {
    publish(validation: MessageStatusModel): Promise<void>;
}
