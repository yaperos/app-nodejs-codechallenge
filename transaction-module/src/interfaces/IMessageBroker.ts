/* eslint-disable @typescript-eslint/ban-types */
export interface SubscribeMessageManagerDTO {
  topic: string
  messageKey: string
  function: (data: any) => {}
}
