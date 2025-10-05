import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let key = "key"
    let value1 = "testing value pubsub"
    let value2 = "testing value pubsub again"

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("should fetch latest pubsub data", async () => {
        cache.tcpPubSub.subscribeToPubSub(key)
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        let promiseGetPubSubData = cache.tcpPubSub.getPubSubMessageIncoming(key, cache.tcpReadline)
        await cache.publisher.insertToPublisher(key, value1, cache.grpcReadline)
        let response = await promiseGetPubSubData
        let decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
        expect(value1).toBe(decodedResponse)
        promiseGetPubSubData = cache.tcpPubSub.getPubSubMessageIncoming(key, cache.tcpReadline)
        await cache.publisher.insertToPublisher(key, value2, cache.grpcReadline)
        response = await promiseGetPubSubData
        decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
        expect(value2).toBe(decodedResponse)
    })
})
