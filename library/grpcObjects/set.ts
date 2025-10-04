import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"

export class GrpcSet {
    private static instance: GrpcSet
    private static grpcConn: net.Socket

    static getInstance(grpcConn: net.Socket): GrpcSet {
        if (!GrpcSet.instance) {
            GrpcSet.instance = new GrpcSet()
            GrpcSet.grpcConn = grpcConn
        }
        return GrpcSet.instance
    }

    insertToSet(key: string, value: string[]) {
        let setInsert: GrpcMessageType = {
            messageType: GrpcMessageTypes.InsertToSet,
            input: {
                key,
                value
            },
            key
        }
        GrpcSet.grpcConn.write(JSON.stringify(setInsert) + "\n")
    }

    setHasMember(key: string, value: string) {
        let setHasMemberInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.SetHasMember,
            input: {
                key,
                value
            },
            key
        }
        GrpcSet.grpcConn.write(JSON.stringify(setHasMemberInput) + "\n")
    }

    getSetValues(key: string) {
        let getSetValuesInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.GetSetValues,
            input: {
                key,
            },
            key
        }
        GrpcSet.grpcConn.write(JSON.stringify(getSetValuesInput) + "\n")
    }

    setRemoveMember(key: string, value: string) {
        let setRemoveMemberInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.SetRemoveMember,
            input: {
                key,
                value
            },
            key
        }
        GrpcSet.grpcConn.write(JSON.stringify(setRemoveMemberInput) + "\n")
    }
}
