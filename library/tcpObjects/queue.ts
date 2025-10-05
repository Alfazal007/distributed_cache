import * as net from "net"
import { TcpMessageType, type TcpMessageTypes } from "../types"
import * as readline from "readline"

export class TcpQueueManager {
    private static instance: TcpQueueManager
    private static tcpConn: net.Socket

    static getInstance(tcpConn: net.Socket): TcpQueueManager {
        if (!TcpQueueManager.instance) {
            TcpQueueManager.instance = new TcpQueueManager()
            TcpQueueManager.tcpConn = tcpConn
        }
        return TcpQueueManager.instance
    }

    subscribeToQueue(key: string) {
        let subscribeToQueueMessage: TcpMessageTypes = {
            messageType: TcpMessageType.QUEUE,
            key,
            subscribe: true
        }
        TcpQueueManager.tcpConn.write(JSON.stringify(subscribeToQueueMessage) + "\n")
    }

    getQueueMessageIncoming(key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            const online = (line: string) => {
                if (line != "PONG") {
                    try {
                        const response = JSON.parse(line)
                        if (response.messageType == TcpMessageType.QUEUE && response.key == key) {
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
