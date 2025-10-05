import * as net from "net"
import * as readline from "readline"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"

export class GrpcStream {
    private static instance: GrpcStream
    private static grpcConn: net.Socket

    static getInstance(grpcConn: net.Socket): GrpcStream {
        if (!GrpcStream.instance) {
            GrpcStream.instance = new GrpcStream()
            GrpcStream.grpcConn = grpcConn
        }
        return GrpcStream.instance
    }

    insertDataToStream(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let bytesValue = Buffer.from(value).toString('base64')
            let insertDataToStreamInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.InsertDataToStream,
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
            GrpcStream.grpcConn.write(JSON.stringify(insertDataToStreamInput) + "\n")
        })
    }

    getStreamRangeData(key: string, start: number, end: number, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let getStreamRangeDataInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.GetStreamRangeData,
                input: {
                    key,
                    start,
                    end
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
            GrpcStream.grpcConn.write(JSON.stringify(getStreamRangeDataInput) + "\n")
        })
    }

    removeDataFromStream(key: string, id: number, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let cryptoId = crypto.randomUUID()
            let getStreamRangeDataInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.RemoveDataFromStream,
                input: {
                    key,
                    id
                },
                key,
                requestId: cryptoId
            }
            const online = (line: string) => {
                try {
                    const response = JSON.parse(line)
                    if (response.requestId == cryptoId) {
                        resolve(response)
                    } else {
                        rl.once("line", online)
                    }
                } catch (err) {
                    reject(err)
                }
            }
            rl.once("line", online)
            GrpcStream.grpcConn.write(JSON.stringify(getStreamRangeDataInput) + "\n")
        })
    }
}
