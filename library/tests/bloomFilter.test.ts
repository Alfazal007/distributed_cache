import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let key1 = "key1"
    let key2 = "key2"
    let value1 = "value1"
    let value2 = "value2"

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("should insert value into bloomfilters", async () => {
        let responses = []
        responses.push(await cache.bloomFilters.insertToBloomFilters(key1, value1, cache.grpcReadline))
        responses.push(await cache.bloomFilters.insertToBloomFilters(key1, value2, cache.grpcReadline))
        responses.push(await cache.bloomFilters.insertToBloomFilters(key2, value1, cache.grpcReadline))
        responses.push(await cache.bloomFilters.insertToBloomFilters(key2, value2, cache.grpcReadline))
        for (let i = 0; i < 4; i++) {
            expect(responses[i].success == true)
        }
    })

    it("should check if a value exists in bloomfilters", async () => {
        let responses = []
        responses.push(await cache.bloomFilters.existsInBf(key1, value1, cache.grpcReadline))
        responses.push(await cache.bloomFilters.existsInBf(key1, value2, cache.grpcReadline))
        responses.push(await cache.bloomFilters.existsInBf(key2, value1, cache.grpcReadline))
        responses.push(await cache.bloomFilters.existsInBf(key2, value2, cache.grpcReadline))
        responses.push(await cache.bloomFilters.existsInBf(key2, "kaidou", cache.grpcReadline))
        for (let i = 0; i < 4; i++) {
            expect(responses[i].exists == true)
        }
        expect(responses[4].exists == false)
    })
})
