import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"

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
        let response = await cache.stream.insertDataToStream(key1, value1, cache.grpcReadline)
        expect(response.success == true)
        response = cache.stream.insertDataToStream(key1, value2, cache.grpcReadline)
        expect(response.success == true)
    })

    it("should get range data from the stream", async () => {
        let ranges: number[] = []
        let responses = []
        responses.push(await cache.stream.insertDataToStream(key2, value1, cache.grpcReadline))
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        responses.push(await cache.stream.insertDataToStream(key2, value2, cache.grpcReadline))
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        responses.push(await cache.stream.insertDataToStream(key2, value2, cache.grpcReadline))
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        responses.push(await cache.stream.insertDataToStream(key2, value1, cache.grpcReadline))
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        responses.push(await cache.stream.insertDataToStream(key2, value1, cache.grpcReadline))
        for (let i = 0; i < 5; i++) {
            ranges.push(responses[i].id)
        }
        let curRes = []
        curRes.push(await cache.stream.getStreamRangeData(key2, ranges[0] as number, ranges[2] as number, cache.grpcReadline))
        curRes.push(await cache.stream.getStreamRangeData(key2, ranges[1] as number, ranges[4] as number, cache.grpcReadline))
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
    })

    it("should remove value from stream", async () => {
        let responses = []
        responses.push(await cache.stream.insertDataToStream(key3, value1, cache.grpcReadline))
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        responses.push(await cache.stream.insertDataToStream(key3, value2, cache.grpcReadline))
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        responses.push(await cache.stream.insertDataToStream(key3, value3, cache.grpcReadline))
        let ranges: number[] = []
        for (let i = 0; i < responses.length; i++) {
            let res = responses[i].id
            ranges.push(res)
        }
        responses.length = 0
        responses.push(await cache.stream.getStreamRangeData(key3, ranges[0] as number, ranges[2] as number, cache.grpcReadline))
        responses.push(await cache.stream.removeDataFromStream(key3, ranges[1] as number, cache.grpcReadline))
        responses.push(await cache.stream.getStreamRangeData(key3, ranges[0] as number, ranges[2] as number, cache.grpcReadline))
        let beforeDeleteData = responses[0].value
        let afterDeleteData = responses[2].value
        let expectedBefore = [value1, value2, value3]
        let expectedAfter = [value1, value3]
        for (let i = 0; i < expectedBefore.length; i++) {
            expect(atob(beforeDeleteData[i])).toStrictEqual(expectedBefore[i] as string)
        }
        for (let i = 0; i < expectedAfter.length; i++) {
            expect(atob(afterDeleteData[i])).toStrictEqual(expectedAfter[i] as string)
        }
    })
})

