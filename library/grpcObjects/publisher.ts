import * as net from "net"
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

    insertToPublisher(key: string, value: string) {
        let bytesValue = Buffer.from(value).toString("base64")
        let mapInsert: GrpcMessageType = {
            messageType: GrpcMessageTypes.PublishMessage,
            input: {
                key,
                value: bytesValue
            },
            key
        }
        GrpcPublisher.grpcConn.write(JSON.stringify(mapInsert) + "\n")
    }
}
