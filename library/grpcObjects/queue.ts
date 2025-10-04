import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"

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

    insertFrontOfQueue(key: string, value: string) {
        let bytesValue = Buffer.from(value).toString('base64')
        let insertFrontOfQueueMsg: GrpcMessageType = {
            messageType: GrpcMessageTypes.QueueInsertFront,
            input: {
                key,
                value: bytesValue
            },
            key
        }
        GrpcQueue.grpcConn.write(JSON.stringify(insertFrontOfQueueMsg) + "\n")
    }

    insertBackOfQueue(key: string, value: string) {
        let bytesValue = Buffer.from(value).toString('base64')
        let insertBackOfQueueMsg: GrpcMessageType = {
            messageType: GrpcMessageTypes.QueueInsertBack,
            input: {
                key,
                value: bytesValue
            },
            key
        }
        GrpcQueue.grpcConn.write(JSON.stringify(insertBackOfQueueMsg) + "\n")
    }

    removeFrontOfQueue(key: string) {
        let removeFrontOfQueueMsg: GrpcMessageType = {
            messageType: GrpcMessageTypes.QueueRemoveFront,
            input: {
                key,
            },
            key
        }
        GrpcQueue.grpcConn.write(JSON.stringify(removeFrontOfQueueMsg) + "\n")
    }

    removeBackOfQueue(key: string) {
        let removeBackOfQueueMsg: GrpcMessageType = {
            messageType: GrpcMessageTypes.QueueRemoveBack,
            input: {
                key,
            },
            key
        }
        GrpcQueue.grpcConn.write(JSON.stringify(removeBackOfQueueMsg) + "\n")
    }
}
