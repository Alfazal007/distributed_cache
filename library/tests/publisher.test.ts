import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"
import { Cache } from "../cacheClass.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let key1 = "key1"
    let key2 = "key2"
    let value1 = "value1"
    let value2 = "value2"

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("should publish message", async () => {
        let index = 0
        cache.publisher.insertToPublisher(key1, value1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 200))
        cache.publisher.insertToPublisher(key1, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 200))
        cache.publisher.insertToPublisher(key2, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 200))
        cache.publisher.insertToPublisher(key2, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 200))
        for (let i = 0; i < 4; i++) {
            let res = JSON.parse(Cache.currentGrpcData[index++] as string)
            expect(res.success == true)
        }
        cache.clearData()
    })
})
