import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"
import * as readline from "readline"

export class GrpcBloomFilters {
    private static instance: GrpcBloomFilters
    private static grpcConn: net.Socket

    static getInstance(grpcConn: net.Socket): GrpcBloomFilters {
        if (!GrpcBloomFilters.instance) {
            GrpcBloomFilters.instance = new GrpcBloomFilters()
            GrpcBloomFilters.grpcConn = grpcConn
        }
        return GrpcBloomFilters.instance
    }

    insertToBloomFilters(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let bytesValue = Buffer.from(value).toString("base64")
            let bfInsertInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.InsertToBf,
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
            GrpcBloomFilters.grpcConn.write(JSON.stringify(bfInsertInput) + "\n")
        })
    }

    existsInBf(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let bytesValue = Buffer.from(value).toString("base64")
            let existsInBfInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.ExistsInBf,
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
            GrpcBloomFilters.grpcConn.write(JSON.stringify(existsInBfInput) + "\n")
        })
    }
}
