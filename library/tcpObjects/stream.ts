import * as net from "net"
import { TcpMessageType, type TcpMessageTypes } from "../types"
import * as readline from "readline"

export class TcpStreamManager {
    private static instance: TcpStreamManager
    private static tcpConn: net.Socket

    static getInstance(tcpConn: net.Socket): TcpStreamManager {
        if (!TcpStreamManager.instance) {
            TcpStreamManager.instance = new TcpStreamManager()
            TcpStreamManager.tcpConn = tcpConn
        }
        return TcpStreamManager.instance
    }

    subscribeToStream(key: string) {
        let subscribeToQueueMessage: TcpMessageTypes = {
            messageType: TcpMessageType.STREAM,
            key,
            subscribe: true
        }
        TcpStreamManager.tcpConn.write(JSON.stringify(subscribeToQueueMessage) + "\n")
    }

    getStreamMessageIncoming(key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            const online = (line: string) => {
                if (line != "PONG") {
                    try {
                        const response = JSON.parse(line)
                        if (response.messageType == TcpMessageType.STREAM && response.key == key) {
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
