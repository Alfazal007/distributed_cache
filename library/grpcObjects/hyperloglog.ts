import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"

/*
    
*/
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

    insertDataToHLL(key: string, value: string) {
        let bytesData = Buffer.from(value).toString("base64")
        let insertDataToHLLInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.InsertDataToHLL,
            input: {
                key,
                value: bytesData
            },
            key
        }
        GrpcHll.grpcConn.write(JSON.stringify(insertDataToHLLInput) + "\n")
    }

    getCountOfHll(key: string) {
        let getCountOfHllInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.GetCountFromHLL,
            input: {
                key,
            },
            key
        }
        GrpcHll.grpcConn.write(JSON.stringify(getCountOfHllInput) + "\n")
    }

    mergeHll(key1: string, key2: string, destination: string) {
        let mergeHllInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.InsertDataToHLL,
            input: {
                key1,
                key2,
                dest: destination
            },
            key: key1
        }
        GrpcHll.grpcConn.write(JSON.stringify(mergeHllInput) + "\n")
    }
}
