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

    it("should insert value into hashmap", async () => {
        let response = await cache.hashmap.insertToHashMap(key1, value1, cache.grpcReadline)
        expect(response.result == 1)
        response = await cache.hashmap.insertToHashMap(key2, value2, cache.grpcReadline)
        expect(response.result == 1)
    })

    it("should fetch value from hashmap", async () => {
        let response = await cache.hashmap.fetchFromHashMap(key1, cache.grpcReadline)
        expect(response.value == value1)
        response = await cache.hashmap.fetchFromHashMap(key2, cache.grpcReadline)
        expect(response.value == value2)
        response = await cache.hashmap.fetchFromHashMap("key3", cache.grpcReadline)
        expect(response.value == value2)
    })

    it("should test if a key got deleted or not", async () => {
        let response = await cache.hashmap.fetchFromHashMap(key1, cache.grpcReadline)
        expect(response.value == value1)
        response = await cache.hashmap.deleteFromHashMap(key1, cache.grpcReadline)
        expect(response.result).toBe(1)
        response = await cache.hashmap.deleteFromHashMap("randomkey", cache.grpcReadline)
        expect(response.result).toBe(-1)
    })
})
