import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"

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

    insertToHashMap(key: string, value: string) {
        let mapInsert: GrpcMessageType = {
            messageType: GrpcMessageTypes.MapInsert,
            input: {
                key,
                value
            },
            key
        }
        GrpcHashMap.grpcConn.write(JSON.stringify(mapInsert) + "\n")
    }

    fetchFromHashMap(key: string) {
        let mapFetch: GrpcMessageType = {
            messageType: GrpcMessageTypes.MapFetch,
            input: {
                key,
            },
            key
        }
        GrpcHashMap.grpcConn.write(JSON.stringify(mapFetch) + "\n")
    }

    deleteFromHashMap(key: string) {
        let mapDelete: GrpcMessageType = {
            messageType: GrpcMessageTypes.MapDelete,
            input: {
                key,
            },
            key
        }
        GrpcHashMap.grpcConn.write(JSON.stringify(mapDelete) + "\n")
    }
}
