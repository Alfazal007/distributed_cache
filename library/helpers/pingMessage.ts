import { type TcpMessageTypes, TcpMessageType } from "../types"

export function pingMessage() {
    const pingMessage: TcpMessageTypes = {
        key: "PINGMESSAGE",
        messageType: TcpMessageType.PING,
        subscribe: true
    }
    let jsonMessage = JSON.stringify(pingMessage)
    return jsonMessage
}
