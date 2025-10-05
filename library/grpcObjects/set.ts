import * as net from "net"
import { GrpcMessageTypes, type GrpcMessageType } from "../types"
import * as readline from "readline"

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

    insertToSet(key: string, value: string[], rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let setInsert: GrpcMessageType = {
                messageType: GrpcMessageTypes.InsertToSet,
                input: {
                    key,
                    value
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
            GrpcSet.grpcConn.write(JSON.stringify(setInsert) + "\n")
        })
    }

    setHasMember(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let setHasMemberInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.SetHasMember,
                input: {
                    key,
                    value
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
            GrpcSet.grpcConn.write(JSON.stringify(setHasMemberInput) + "\n")
        })
    }

    getSetValues(key: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let getSetValuesInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.GetSetValues,
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
            GrpcSet.grpcConn.write(JSON.stringify(getSetValuesInput) + "\n")
        })
    }

    setRemoveMember(key: string, value: string, rl: readline.Interface): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = crypto.randomUUID()
            let setRemoveMemberInput: GrpcMessageType = {
                messageType: GrpcMessageTypes.SetRemoveMember,
                input: {
                    key,
                    value
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
            GrpcSet.grpcConn.write(JSON.stringify(setRemoveMemberInput) + "\n")
        })
    }
}
