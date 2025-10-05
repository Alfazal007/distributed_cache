import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"

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
        let response = await cache.set.insertToSet(key1, [value1Key1, value2Key1], cache.grpcReadline)
        expect(response.result == 1)
        response = await cache.set.insertToSet(key2, [value3Key2], cache.grpcReadline)
        expect(response.result == 1)
    })

    it("set has a element or not", async () => {
        let responses = []
        responses.push(await cache.set.setHasMember(key1, value1Key1, cache.grpcReadline))
        responses.push(await cache.set.setHasMember(key1, value2Key1, cache.grpcReadline))
        responses.push(await cache.set.setHasMember(key1, value3Key2, cache.grpcReadline))
        responses.push(await cache.set.setHasMember(key2, value3Key2, cache.grpcReadline))
        responses.push(await cache.set.setHasMember(key2, value1Key1, cache.grpcReadline))
        let expected = [true, true, false, true, false]
        for (let i = 0; i < expected.length; i++) {
            let expectedResponse = expected[i] as boolean
            let res = responses[i]
            if (expectedResponse == true) {
                expect(res.hasValue == expectedResponse)
            }
            else {
                let { requestId, ...rest } = res
                expect(rest).toStrictEqual({})
            }
        }
    })

    it("should get values from a set", async () => {
        let response = await cache.set.getSetValues(key1, cache.grpcReadline)
        expect(response.values).toStrictEqual([value1Key1, value2Key1])
        response = await cache.set.getSetValues(key2, cache.grpcReadline)
        expect(response.values).toStrictEqual([value3Key2])
        response = await cache.set.getSetValues("key3", cache.grpcReadline)
        let { requestId, ...rest } = response
        expect(rest).toStrictEqual({})
    })

    it("should remove value from a set", async () => {
        let response = await cache.set.setRemoveMember(key1, value1Key1, cache.grpcReadline)
        expect(response.result).toStrictEqual(1)
        response = await cache.set.setRemoveMember(key1, value3Key2, cache.grpcReadline)
        expect(response.result).toStrictEqual(-1)
        response = await cache.set.setRemoveMember(key2, value3Key2, cache.grpcReadline)
        expect(response.result).toStrictEqual(1)
        response = await cache.set.getSetValues(key1, cache.grpcReadline)
        expect(response.values).toStrictEqual([value2Key1])
        response = await cache.set.getSetValues(key2, cache.grpcReadline)
        let { requestId, ...rest } = response
        expect(rest).toStrictEqual({})
    })
})
