import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let key1 = "key1"
    let key2 = "key2"
    let value1 = "value1"
    let value2 = "value2"
    let value3 = "value3"

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("should insert value into the hll", async () => {
        let responses = []
        responses.push(await cache.hll.insertDataToHLL(key1, value1, cache.grpcReadline))
        responses.push(await cache.hll.insertDataToHLL(key1, value2, cache.grpcReadline))
        responses.push(await cache.hll.insertDataToHLL(key1, value3, cache.grpcReadline))
        responses.push(await cache.hll.insertDataToHLL(key2, value1, cache.grpcReadline))
        responses.push(await cache.hll.insertDataToHLL(key2, value2, cache.grpcReadline))
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        for (let i = 0; i < 5; i++) {
            expect(responses[i].success == true)
        }
    })

    it("should get the count for a hll", async () => {
        let response = await cache.hll.getCountOfHll(key1, cache.grpcReadline)
        expect(response.count == 3)
        response = await cache.hll.getCountOfHll(key2, cache.grpcReadline)
        expect(response.count == 2)
    })

    it("should merge two hll into a new hll and return count", async () => {
        let response = await cache.hll.getCountOfHll(key1, cache.grpcReadline)
        expect(response.count == 3)
        response = await cache.hll.getCountOfHll(key2, cache.grpcReadline)
        expect(response.count == 2)
        response = await cache.hll.mergeHll(key1, key2, "dest", cache.grpcReadline)
        expect(response.count == 5)
    })
})
