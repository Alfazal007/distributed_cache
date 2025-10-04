import * as net from "net"
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

    insertDataToStream(key: string, value: string) {
        let bytesValue = Buffer.from(value).toString('base64')
        let insertDataToStreamInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.InsertDataToStream,
            input: {
                key,
                value: bytesValue
            },
            key
        }
        GrpcStream.grpcConn.write(JSON.stringify(insertDataToStreamInput) + "\n")
    }

    getStreamRangeData(key: string, start: number, end: number) {
        let getStreamRangeDataInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.GetStreamRangeData,
            input: {
                key,
                start,
                end
            },
            key
        }
        GrpcStream.grpcConn.write(JSON.stringify(getStreamRangeDataInput) + "\n")
    }

    removeDataFromStream(key: string, id: number) {
        let getStreamRangeDataInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.RemoveDataFromStream,
            input: {
                key,
                id
            },
            key
        }
        GrpcStream.grpcConn.write(JSON.stringify(getStreamRangeDataInput) + "\n")
    }
}
