import * as net from "net"
import { TcpMessageType, type TcpMessageTypes } from "../types"
import * as readline from "readline"

export class TcpPubSubManager {
    private static instance: TcpPubSubManager
    private static tcpConn: net.Socket

    static getInstance(tcpConn: net.Socket): TcpPubSubManager {
        if (!TcpPubSubManager.instance) {
            TcpPubSubManager.instance = new TcpPubSubManager()
            TcpPubSubManager.tcpConn = tcpConn
        }
        return TcpPubSubManager.instance
    }

    subscribeToPubSub(key: string) {
        let subscribeToPubSubMessage: TcpMessageTypes = {
            messageType: TcpMessageType.SUBSCRIBER,
            key,
            subscribe: true
        }
        TcpPubSubManager.tcpConn.write(JSON.stringify(subscribeToPubSubMessage) + "\n")
    }

    getPubSubMessageIncoming(key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            const online = (line: string) => {
                if (line != "PONG") {
                    try {
                        const response = JSON.parse(line)
                        if (response.messageType == TcpMessageType.SUBSCRIBER && response.key == key) {
                            resolve(response.value)
                        } else {
                            rl.once("line", online)
                        }
                    } catch (err) {
                        reject(err)
                    }
                }
            }
            rl.once("line", online)
        })
    }
}
