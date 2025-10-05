import * as net from "net"
import * as readline from "readline"
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

    insertToSortedSet(mainKey: string, key: string, value: number, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let insertToSortedSetInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.InsertToSortedSet,
                input: {
                    key,
                    value,
                    mainKey
                },
                key: mainKey,
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
            GrpcSortedSet.grpcConn.write(JSON.stringify(insertToSortedSetInput) + "\n")
        })
    }

    getScoreOfSortedSet(mainKey: string, key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let scoresOfSortedSetInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.GetScoreSortedSet,
                input: {
                    key,
                    mainKey
                },
                key: mainKey,
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
            GrpcSortedSet.grpcConn.write(JSON.stringify(scoresOfSortedSetInput) + "\n")
        })
    }

    getRankSortedSet(mainKey: string, key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let getRankSortedSetInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.GetRankSortedSet,
                input: {
                    key,
                    mainKey
                },
                key: mainKey,
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
            GrpcSortedSet.grpcConn.write(JSON.stringify(getRankSortedSetInput) + "\n")
        })
    }

    getRankAscOrder(mainKey: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let getRankSortedSetInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.GetRankMembersAsc,
                input: {
                    mainKey
                },
                key: mainKey,
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
            GrpcSortedSet.grpcConn.write(JSON.stringify(getRankSortedSetInput) + "\n")
        })
    }

    getRankDescOrder(mainKey: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let getRankSortedSetInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.GetRankMembersDesc,
                input: {
                    mainKey
                },
                key: mainKey,
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
            GrpcSortedSet.grpcConn.write(JSON.stringify(getRankSortedSetInput) + "\n")
        })
    }

    removeFromSortedSet(mainKey: string, key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let insertToSortedSetInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.RemoveFromSortedSet,
                input: {
                    key,
                    mainKey
                },
                key: mainKey,
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
            GrpcSortedSet.grpcConn.write(JSON.stringify(insertToSortedSetInput) + "\n")
        })
    }
}
