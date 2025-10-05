import * as net from "net"
import * as readline from "readline"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"

export class GrpcHll {
    private static instance: GrpcHll
    private static grpcConn: net.Socket

    static getInstance(grpcConn: net.Socket): GrpcHll {
        if (!GrpcHll.instance) {
            GrpcHll.instance = new GrpcHll()
            GrpcHll.grpcConn = grpcConn
        }
        return GrpcHll.instance
    }

    insertDataToHLL(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let bytesData = Buffer.from(value).toString("base64")
            let insertDataToHLLInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.InsertDataToHLL,
                input: {
                    key,
                    value: bytesData
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
            GrpcHll.grpcConn.write(JSON.stringify(insertDataToHLLInput) + "\n")
        })
    }

    getCountOfHll(key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let getCountOfHllInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.GetCountFromHLL,
                input: {
                    key,
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
            GrpcHll.grpcConn.write(JSON.stringify(getCountOfHllInput) + "\n")
        })
    }

    mergeHll(key1: string, key2: string, destination: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let mergeHllInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.InsertDataToHLL,
                input: {
                    key1,
                    key2,
                    dest: destination
                },
                key: key1,
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
            GrpcHll.grpcConn.write(JSON.stringify(mergeHllInput) + "\n")
        })
    }
}
