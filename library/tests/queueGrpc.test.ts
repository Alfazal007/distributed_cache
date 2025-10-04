import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"
import { Cache } from "../cacheClass.ts"

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
        let index = 0
        cache.queue.insertFrontOfQueue(key1, front1Value)
        cache.queue.insertFrontOfQueue(key2, front2Value)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result == 1)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result == 1)
        cache.clearData()
    })

    it("insert into the back of the queue", async () => {
        let index = 0
        cache.queue.insertBackOfQueue(key1, back1Value)
        cache.queue.insertBackOfQueue(key2, back2Value)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result == 1)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result == 1)
        cache.clearData()
    })

    it("remove from the front of the queue", async () => {
        let index = 0
        cache.queue.removeFrontOfQueue(key1)
        cache.queue.removeFrontOfQueue(key1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(front1Value == atob(res.value))
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(back1Value == atob(res.value))
        cache.clearData()
    })

    it("remove from the back of the queue", async () => {
        let index = 0
        cache.queue.removeBackOfQueue(key2)
        cache.queue.removeBackOfQueue(key2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(back2Value == atob(res.value))
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(front2Value == atob(res.value))
        cache.clearData()
    })
})
