import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let key = "key"
    let value1 = "testing value stream data"
    let value2 = "testing value stream data again"

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("should fetch latest stream data", async () => {
        cache.tcpStream.subscribeToStream(key)
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        let promiseGetStreamData = cache.tcpStream.getStreamMessageIncoming(key, cache.tcpReadline)
        await cache.stream.insertDataToStream(key, value1, cache.grpcReadline)
        let response = await promiseGetStreamData
        let decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
        expect(value1).toBe(decodedResponse)
        promiseGetStreamData = cache.tcpStream.getStreamMessageIncoming(key, cache.tcpReadline)
        await cache.stream.insertDataToStream(key, value2, cache.grpcReadline)
        response = await promiseGetStreamData
        decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
        expect(value2).toBe(decodedResponse)
    })
})
