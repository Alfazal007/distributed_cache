import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"
import * as readline from "readline"

export class GrpcQueue {
    private static instance: GrpcQueue
    private static grpcConn: net.Socket

    static getInstance(grpcConn: net.Socket): GrpcQueue {
        if (!GrpcQueue.instance) {
            GrpcQueue.instance = new GrpcQueue()
            GrpcQueue.grpcConn = grpcConn
        }
        return GrpcQueue.instance
    }

    insertFrontOfQueue(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let bytesValue = Buffer.from(value).toString('base64')
            let insertFrontOfQueueMsg: GrpcMessageType = {
                messageType: GrpcMessageTypes.QueueInsertFront,
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
            GrpcQueue.grpcConn.write(JSON.stringify(insertFrontOfQueueMsg) + "\n")
        })
    }

    insertBackOfQueue(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let bytesValue = Buffer.from(value).toString('base64')
            let insertBackOfQueueMsg: GrpcMessageType = {
                messageType: GrpcMessageTypes.QueueInsertBack,
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
            GrpcQueue.grpcConn.write(JSON.stringify(insertBackOfQueueMsg) + "\n")
        })
    }

    removeFrontOfQueue(key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let removeFrontOfQueueMsg: GrpcMessageType = {
                messageType: GrpcMessageTypes.QueueRemoveFront,
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
            GrpcQueue.grpcConn.write(JSON.stringify(removeFrontOfQueueMsg) + "\n")
        })
    }

    removeBackOfQueue(key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let removeBackOfQueueMsg: GrpcMessageType = {
                messageType: GrpcMessageTypes.QueueRemoveBack,
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
            GrpcQueue.grpcConn.write(JSON.stringify(removeBackOfQueueMsg) + "\n")
        })
    }
}
