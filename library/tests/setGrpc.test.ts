import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"
import { Cache } from "../cacheClass.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let key1 = "key1"
    let key2 = "key2"
    let value1Key1 = "value1Key1"
    let value2Key1 = "value2Key1"
    let value3Key2 = "value3Key2"

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("should insert value into set", async () => {
        let index = 0
        cache.set.insertToSet(key1, [value1Key1, value2Key1])
        cache.set.insertToSet(key2, [value3Key2])
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result == 1)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result == 1)
        cache.clearData()
    })

    it("set has a element or not", async () => {
        let index = 0
        cache.set.setHasMember(key1, value1Key1)
        cache.set.setHasMember(key1, value2Key1)
        cache.set.setHasMember(key1, value3Key2)
        cache.set.setHasMember(key2, value3Key2)
        cache.set.setHasMember(key2, value1Key1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 4000))
        let expected = [true, true, false, true, false]
        for (let i = 0; i < expected.length; i++) {
            let expectedResponse = expected[i] as boolean
            let res = JSON.parse(Cache.currentGrpcData[index++] as string)
            if (expectedResponse == true) {
                expect(res.hasValue == expectedResponse)
            }
            else {
                expect(res).toStrictEqual({})
            }
        }
        cache.clearData()
    })

    it("should get values from a set", async () => {
        let index = 0
        cache.set.getSetValues(key1)
        cache.set.getSetValues(key2)
        cache.set.getSetValues("key3")
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.values).toStrictEqual([value1Key1, value2Key1])
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.values).toStrictEqual([value3Key2])
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res).toStrictEqual({})
        cache.clearData()
    })

    it("should remove value from a set", async () => {
        let index = 0
        cache.set.setRemoveMember(key1, value1Key1)
        cache.set.setRemoveMember(key1, value3Key2)
        cache.set.setRemoveMember(key2, value3Key2)
        cache.set.getSetValues(key1)
        cache.set.getSetValues(key2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result).toStrictEqual(1)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result).toStrictEqual(-1)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.result).toStrictEqual(1)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.values).toStrictEqual([value2Key1])
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res).toStrictEqual({})
        cache.clearData()
    })
})
