import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"
import * as readline from "readline"

export class GrpcHashMap {
    private static instance: GrpcHashMap
    private static grpcConn: net.Socket

    static getInstance(grpcConn: net.Socket): GrpcHashMap {
        if (!GrpcHashMap.instance) {
            GrpcHashMap.instance = new GrpcHashMap()
            GrpcHashMap.grpcConn = grpcConn
        }
        return GrpcHashMap.instance
    }

    insertToHashMap(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let mapInsert: GrpcMessageType = {
                messageType: GrpcMessageTypes.MapInsert,
                input: {
                    key,
                    value
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
            console.log("writing")
            GrpcHashMap.grpcConn.write(JSON.stringify(mapInsert) + "\n")
        })
    }

    fetchFromHashMap(key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let mapFetch: GrpcMessageType = {
                messageType: GrpcMessageTypes.MapFetch,
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
            GrpcHashMap.grpcConn.write(JSON.stringify(mapFetch) + "\n")
        })
    }

    deleteFromHashMap(key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let mapDelete: GrpcMessageType = {
                messageType: GrpcMessageTypes.MapDelete,
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
            GrpcHashMap.grpcConn.write(JSON.stringify(mapDelete) + "\n")
        })
    }
}
