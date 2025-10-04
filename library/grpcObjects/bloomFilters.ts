import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"

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

    insertToBloomFilters(key: string, value: string) {
        let bytesValue = Buffer.from(value).toString("base64")
        let bfInsertInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.InsertToBf,
            input: {
                key,
                value: bytesValue
            },
            key
        }
        GrpcBloomFilters.grpcConn.write(JSON.stringify(bfInsertInput) + "\n")
    }

    existsInBf(key: string, value: string) {
        let bytesValue = Buffer.from(value).toString("base64")
        let existsInBfInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.ExistsInBf,
            input: {
                key,
                value: bytesValue
            },
            key
        }
        GrpcBloomFilters.grpcConn.write(JSON.stringify(existsInBfInput) + "\n")
    }
}
