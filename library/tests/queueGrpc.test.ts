import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let key1 = "queueKey1"
    let key2 = "queueKey2"
    let front1Value = "front1"
    let front2Value = "front2"
    let back1Value = "back1"
    let back2Value = "back2"

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("insert into the front of the queue", async () => {
        let response = await cache.queue.insertFrontOfQueue(key1, front1Value, cache.grpcReadline)
        expect(response.result == 1)
        response = await cache.queue.insertFrontOfQueue(key2, front2Value, cache.grpcReadline)
        expect(response.result == 1)
    })

    it("insert into the back of the queue", async () => {
        let response = await cache.queue.insertBackOfQueue(key1, back1Value, cache.grpcReadline)
        expect(response.result == 1)
        response = await cache.queue.insertBackOfQueue(key2, back2Value, cache.grpcReadline)
        expect(response.result == 1)
    })

    it("remove from the front of the queue", async () => {
        let response = await cache.queue.removeFrontOfQueue(key1, cache.grpcReadline)
        expect(front1Value == atob(response.value))
        response = await cache.queue.removeFrontOfQueue(key1, cache.grpcReadline)
        expect(back1Value == atob(response.value))
    })

    it("remove from the back of the queue", async () => {
        let response = await cache.queue.removeBackOfQueue(key2, cache.grpcReadline)
        expect(back2Value == atob(response.value))
        response = await cache.queue.removeBackOfQueue(key2, cache.grpcReadline)
        expect(front2Value == atob(response.value))
    })
})
