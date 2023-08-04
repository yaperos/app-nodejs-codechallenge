export interface messageBody{
    value:string
}
export interface IKafkaConfig{
    clientId: string,
    brokers:Array<string>,
    groupID:string,
    consumerID:string
}

export interface IKafkaMessage{
    topic:string,
    message: Array<messageBody>
}