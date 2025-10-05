import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let key = "key"
    let value1 = "testing value"
    let value2 = "testing value again"

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("should insert value into hashmap", async () => {
        cache.tcpQueue.subscribeToQueue(key)
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        let promiseGetQueueData = cache.tcpQueue.getQueueMessageIncoming(key, cache.tcpReadline)
        await cache.queue.insertFrontOfQueue(key, value1, cache.grpcReadline)
        let response = await promiseGetQueueData
        let decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
        expect(value1).toBe(decodedResponse)
        promiseGetQueueData = cache.tcpQueue.getQueueMessageIncoming(key, cache.tcpReadline)
        await cache.queue.insertFrontOfQueue(key, value2, cache.grpcReadline)
        response = await promiseGetQueueData
        decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
        expect(value2).toBe(decodedResponse)
    })
})
