import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"
import { Cache } from "../cacheClass.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let key1 = "key1"
    let key2 = "key2"
    let key3 = "key3"
    let value1 = "value1"
    let value2 = "value2"
    let value3 = "value3"

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("should insert value into stream", async () => {
        let index = 0
        cache.stream.insertDataToStream(key1, value1)
        cache.stream.insertDataToStream(key1, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.success == true)
        res = JSON.parse(Cache.currentGrpcData[index++] as string)
        expect(res.success == true)
        cache.clearData()
    })

    it("should get range data from the stream", async () => {
        let ranges: number[] = []
        let index = 0
        cache.stream.insertDataToStream(key2, value1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        cache.stream.insertDataToStream(key2, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        cache.stream.insertDataToStream(key2, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        cache.stream.insertDataToStream(key2, value1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        cache.stream.insertDataToStream(key2, value1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        for (let i = 0; i < 5; i++) {
            let res = JSON.parse(Cache.currentGrpcData[index++] as string)
            ranges.push(res.id)
        }
        cache.clearData()
        cache.stream.getStreamRangeData(key2, ranges[0] as number, ranges[2] as number)
        cache.stream.getStreamRangeData(key2, ranges[1] as number, ranges[4] as number)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let curRes = []
        index = 0
        for (let i = 0; i < 2; i++) {
            let res = Cache.currentGrpcData[index++] as string
            curRes.push(JSON.parse(res))
        }
        let expected1 = [value1, value2, value2]
        let expected2 = [value2, value2, value1, value1]
        let i = 0
        for (let j = 0; j < expected1.length; j++) {
            expect(expected1[j]).toStrictEqual(atob(curRes[i].value[j]))
        }
        i += 1
        for (let j = 0; j < expected2.length; j++) {
            expect(expected2[j]).toStrictEqual(atob(curRes[i].value[j]))
        }
        cache.clearData()
    }, { timeout: 20000 })

    it("should remove value from stream", async () => {
        let index = 0
        cache.stream.insertDataToStream(key3, value1)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        cache.stream.insertDataToStream(key3, value2)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        cache.stream.insertDataToStream(key3, value3)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let curRes = []
        for (let i = 0; i < 3; i++) {
            let res = Cache.currentGrpcData[index++] as string
            curRes.push(JSON.parse(res))
        }
        let ranges: number[] = []
        for (let i = 0; i < curRes.length; i++) {
            let res = curRes[i].id
            ranges.push(res)
        }
        cache.clearData()
        index = 0
        cache.stream.getStreamRangeData(key3, ranges[0] as number, ranges[2] as number)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        cache.stream.removeDataFromStream(key3, ranges[1] as number)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        cache.stream.getStreamRangeData(key3, ranges[0] as number, ranges[2] as number)
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 2000))
        let beforeDeleteData = JSON.parse(Cache.currentGrpcData[0] as string).value
        let afterDeleteData = JSON.parse(Cache.currentGrpcData[2] as string).value
        let expectedBefore = [value1, value2, value3]
        let expectedAfter = [value1, value3]
        for (let i = 0; i < expectedBefore.length; i++) {
            expect(atob(beforeDeleteData[i])).toStrictEqual(expectedBefore[i] as string)
        }
        for (let i = 0; i < expectedAfter.length; i++) {
            expect(atob(afterDeleteData[i])).toStrictEqual(expectedAfter[i] as string)
        }
        cache.clearData()
    }, { timeout: 20000 })
})

