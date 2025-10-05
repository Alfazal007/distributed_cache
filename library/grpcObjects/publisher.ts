import * as net from "net"
import * as readline from "readline"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"

export class GrpcPublisher {
    private static instance: GrpcPublisher
    private static grpcConn: net.Socket

    static getInstance(grpcConn: net.Socket): GrpcPublisher {
        if (!GrpcPublisher.instance) {
            GrpcPublisher.instance = new GrpcPublisher()
            GrpcPublisher.grpcConn = grpcConn
        }
        return GrpcPublisher.instance
    }

    insertToPublisher(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let bytesValue = Buffer.from(value).toString("base64")
            let mapInsert: GrpcMessageType = {
                messageType: GrpcMessageTypes.PublishMessage,
                input: {
                    key,
                    value: bytesValue
                },
                key,
                requestId: id
            }
            const online = (line: string) => {
                try {
                    const response = JSON.parse(line)
                    if (response.requestId == id) {
                        resolve(response)
                    } else {
                        rl.once("line", online)
                    }
                } catch (err) {
                    reject(err)
                }
            }
            rl.once("line", online)
            GrpcPublisher.grpcConn.write(JSON.stringify(mapInsert) + "\n")
        })
    }
}
