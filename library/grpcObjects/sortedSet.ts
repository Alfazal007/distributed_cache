import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"

export class GrpcSortedSet {
    private static instance: GrpcSortedSet
    private static grpcConn: net.Socket

    static getInstance(grpcConn: net.Socket): GrpcSortedSet {
        if (!GrpcSortedSet.instance) {
            GrpcSortedSet.instance = new GrpcSortedSet()
            GrpcSortedSet.grpcConn = grpcConn
        }
        return GrpcSortedSet.instance
    }

    insertToSortedSet(mainKey: string, key: string, value: number) {
        let insertToSortedSetInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.InsertToSortedSet,
            input: {
                key,
                value,
                mainKey
            },
            key: mainKey
        }
        GrpcSortedSet.grpcConn.write(JSON.stringify(insertToSortedSetInput) + "\n")
    }

    getScoreOfSortedSet(mainKey: string, key: string) {
        let scoresOfSortedSetInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.GetScoreSortedSet,
            input: {
                key,
                mainKey
            },
            key: mainKey
        }
        GrpcSortedSet.grpcConn.write(JSON.stringify(scoresOfSortedSetInput) + "\n")
    }

    getRankSortedSet(mainKey: string, key: string) {
        let getRankSortedSetInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.GetRankSortedSet,
            input: {
                key,
                mainKey
            },
            key: mainKey
        }
        GrpcSortedSet.grpcConn.write(JSON.stringify(getRankSortedSetInput) + "\n")
    }

    getRankAscOrder(mainKey: string) {
        let getRankSortedSetInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.GetRankMembersAsc,
            input: {
                mainKey
            },
            key: mainKey
        }
        GrpcSortedSet.grpcConn.write(JSON.stringify(getRankSortedSetInput) + "\n")
    }

    getRankDescOrder(mainKey: string) {
        let getRankSortedSetInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.GetRankMembersDesc,
            input: {
                mainKey
            },
            key: mainKey
        }
        GrpcSortedSet.grpcConn.write(JSON.stringify(getRankSortedSetInput) + "\n")
    }

    removeFromSortedSet(mainKey: string, key: string) {
        let insertToSortedSetInput: GrpcMessageType = {
            messageType: GrpcMessageTypes.RemoveFromSortedSet,
            input: {
                key,
                mainKey
            },
            key: mainKey
        }
        GrpcSortedSet.grpcConn.write(JSON.stringify(insertToSortedSetInput) + "\n")
    }
}
