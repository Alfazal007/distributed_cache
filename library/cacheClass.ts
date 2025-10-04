import * as net from "net"
import { GrpcHashMap } from "./grpcObjects/hashmap"
import { GrpcQueue } from "./grpcObjects/queue"
import { GrpcSet } from "./grpcObjects/set"
import { GrpcSortedSet } from "./grpcObjects/sortedSet"
import { GrpcStream } from "./grpcObjects/stream"
import { GrpcHll } from "./grpcObjects/hyperloglog"
import { GrpcBloomFilters } from "./grpcObjects/bloomFilters"
import { GrpcPublisher } from "./grpcObjects/publisher"
import * as readline from "readline";

/**
 * Cache class that talks to master and provides necessary functions to talk to the master node
*/
export class Cache {
    host: string
    private static instance: Cache
    static grpcConnection: net.Socket
    static tcpConnection: net.Socket
    public static hashmap: GrpcHashMap
    public static queue: GrpcQueue
    public static set: GrpcSet
    public static sortedSet: GrpcSortedSet
    public static stream: GrpcStream
    public static hll: GrpcHll
    public static bloomFilters: GrpcBloomFilters
    public static publisher: GrpcPublisher

    // TODO:: remove this variable altogether, it is just for testing
    public static currentGrpcData: string[] = []

    static connect(host: string) {
        if (!Cache.instance) {
            Cache.instance = new Cache(host)
            Cache.grpcConnection = Cache.instance.connectToGrpc()
            Cache.tcpConnection = Cache.instance.connectToTcp()
            Cache.hashmap = GrpcHashMap.getInstance(Cache.grpcConnection)
            Cache.queue = GrpcQueue.getInstance(Cache.grpcConnection)
            Cache.set = GrpcSet.getInstance(Cache.grpcConnection)
            Cache.sortedSet = GrpcSortedSet.getInstance(Cache.grpcConnection)
            Cache.stream = GrpcStream.getInstance(Cache.grpcConnection)
            Cache.hll = GrpcHll.getInstance(Cache.grpcConnection)
            Cache.bloomFilters = GrpcBloomFilters.getInstance(Cache.grpcConnection)
            Cache.publisher = GrpcPublisher.getInstance(Cache.grpcConnection)
        }
    }

    private constructor(host: string) {
        this.host = host
    }

    private connectToTcp(): net.Socket {
        const PORT = 8003
        const client = new net.Socket()
        client.connect(PORT, this.host, () => {
            console.log(`Connected to tcp server at ${this.host}:${PORT}`)
        })
        client.on("close", () => {
            console.log("Connection closed")
            process.exit(1)
        })
        client.on("error", (err) => {
            console.error("Connection error:", err.message)
            process.exit(1)
        })
        return client
    }

    private connectToGrpc(): net.Socket {
        const PORT = 8002
        const client = new net.Socket()
        client.connect(PORT, this.host, () => {
            console.log(`Connected to grpc server at ${this.host}:${PORT}`)
        })
        const rl = readline.createInterface({
            input: client,
            crlfDelay: Infinity,
        });
        client.on("close", () => {
            console.log("Connection closed")
            process.exit(1)
        })
        client.on("error", (err) => {
            console.error("Connection error:", err.message)
            process.exit(1)
        })
        rl.on("line", (line: string) => {
            Cache.currentGrpcData.push(line)
        });
        return client
    }

    static clearData() {
        Cache.currentGrpcData.length = 0
    }
}
