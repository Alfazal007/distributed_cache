import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"
import { Cache } from "../cacheClass.ts"

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
        let index = 0
        cache.hll.insertDataToHLL(key1, value1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        cache.hll.insertDataToHLL(key1, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        cache.hll.insertDataToHLL(key1, value3)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        cache.hll.insertDataToHLL(key2, value1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        cache.hll.insertDataToHLL(key2, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        for (let i = 0; i < 5; i++) {
            let res = JSON.parse(Cache.currentGrpcData[index++] as string)
            expect(res.success == true)
        }
        cache.clearData()
    })


    it("should get the count for a hll", async () => {
        let index = 0
        cache.hll.getCountOfHll(key1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        cache.hll.getCountOfHll(key2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.count == 3)
        expect(res.count == 2)
        cache.clearData()
    })

    it("should merge two hll into a new hll and return count", async () => {
        let index = 0
        cache.hll.getCountOfHll(key1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        cache.hll.getCountOfHll(key2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        cache.hll.mergeHll(key1, key2, "dest")
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.count == 3)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.count == 2)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.count == 5)
        cache.clearData()
    })
})
