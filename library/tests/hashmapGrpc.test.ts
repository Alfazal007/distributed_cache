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

    it("should insert value into hashmap", async () => {
        let index = 0
        cache.hashmap.insertToHashMap(key1, value1)
        cache.hashmap.insertToHashMap(key2, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result == 1)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result == 1)
        cache.clearData()
    })

    it("should fetch value from hashmap", async () => {
        let index = 0
        cache.hashmap.fetchFromHashMap(key1)
        cache.hashmap.fetchFromHashMap(key2)
        cache.hashmap.fetchFromHashMap("key3")
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.value == value1)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.value == value2)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res).toStrictEqual({})
        cache.clearData()
    })

    it("should test if a key got deleted or not", async () => {
        let index = 0
        cache.hashmap.fetchFromHashMap(key1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        let res = JSON.parse(Cache.currentGrpcData[index] as string)
        expect(res.value == value1)
        cache.clearData()
        cache.hashmap.deleteFromHashMap(key1)
        cache.hashmap.deleteFromHashMap("randomkey")
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result).toBe(1)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result).toBe(-1)
        cache.clearData()
    })
})
