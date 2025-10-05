import { describe, it, beforeAll, expect } from "bun:test"
import { connect } from "../index.ts"

describe("Cache", () => {
    let cache: ReturnType<typeof connect>
    let mainKey1 = "mk1"
    let mainKey2 = "mk2"

    let key1Mk1 = "key1Mk1"
    let value1Mk1 = 10
    let key2Mk1 = "key2Mk1"
    let value2Mk1 = 30
    let key3Mk1 = "key3Mk1"
    let value3Mk1 = 20

    let key1Mk2 = "key1Mk2"
    let value1Mk2 = 50
    let key2Mk2 = "key2Mk2"
    let value2Mk2 = 40
    let key3Mk2 = "key3Mk2"
    let value3Mk2 = 40

    beforeAll(() => {
        cache = connect("127.0.0.1")
    })

    it("should insert value into sorted set", async () => {
        let responses = []
        responses.push(await cache.sortedSet.insertToSortedSet(mainKey1, key1Mk1, value1Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.insertToSortedSet(mainKey1, key2Mk1, value2Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.insertToSortedSet(mainKey1, key3Mk1, value3Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.insertToSortedSet(mainKey2, key1Mk2, value1Mk2, cache.grpcReadline))
        responses.push(await cache.sortedSet.insertToSortedSet(mainKey2, key2Mk2, value2Mk2, cache.grpcReadline))
        responses.push(await cache.sortedSet.insertToSortedSet(mainKey2, key3Mk2, value3Mk2, cache.grpcReadline))
        for (let i = 0; i < 6; i++) {
            expect(responses[i].result == 1)
        }
    })

    it("should get sorted set scores", async () => {
        let responses = []
        responses.push(await cache.sortedSet.getScoreOfSortedSet(mainKey1, key1Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getScoreOfSortedSet(mainKey1, key2Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getScoreOfSortedSet(mainKey1, key3Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getScoreOfSortedSet(mainKey1, "key4Mk1", cache.grpcReadline))
        responses.push(await cache.sortedSet.getScoreOfSortedSet(mainKey2, key1Mk2, cache.grpcReadline))
        responses.push(await cache.sortedSet.getScoreOfSortedSet(mainKey2, key2Mk2, cache.grpcReadline))
        responses.push(await cache.sortedSet.getScoreOfSortedSet(mainKey2, key3Mk2, cache.grpcReadline))
        let expectedRes = [10, 30, 20, -1, 50, 40, 40]
        for (let i = 0; i < 7; i++) {
            expect(responses[i].score == expectedRes[i])
        }
    })

    it("should get sorted set ranks", async () => {
        let responses = []
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey1, key1Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey1, key2Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey1, key3Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey1, "key4Mk1", cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey2, key1Mk2, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey2, key2Mk2, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey2, key3Mk2, cache.grpcReadline))
        let expectedRes = [1, 3, 2, -1, 3, 2, 1]
        for (let i = 0; i < 7; i++) {
            expect(responses[i].rank == expectedRes[i])
        }
    })

    it("should get sorted set ranks", async () => {
        let responses = []
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey1, key1Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey1, key2Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey1, key3Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey1, "key4Mk1", cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey2, key1Mk2, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey2, key2Mk2, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankSortedSet(mainKey2, key3Mk2, cache.grpcReadline))
        let expectedRes = [1, 3, 2, -1, 3, 2, 1]
        for (let i = 0; i < 7; i++) {
            expect(responses[i].rank == expectedRes[i])
        }
    })

    it("should get ranks in ascending order", async () => {
        let responses = []
        responses.push(await cache.sortedSet.getRankAscOrder(mainKey1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankAscOrder(mainKey2, cache.grpcReadline))
        let expectedFirstMk1 = [
            { score: value1Mk1, name: key1Mk1 },
            { score: value3Mk1, name: key3Mk1 },
            { score: value2Mk1, name: key2Mk1 },
        ]
        let expectedFirstMk2 = [
            { score: value2Mk2, name: key2Mk2 },
            { score: value3Mk2, name: key3Mk2 },
            { score: value1Mk2, name: key1Mk2 },
        ]
        expect(responses[0].membersAndScore).toStrictEqual(expectedFirstMk1)
        expect(responses[1].membersAndScore).toStrictEqual(expectedFirstMk2)
        responses.length = 0
        responses.push(await cache.sortedSet.insertToSortedSet(mainKey1, key1Mk1, 100, cache.grpcReadline))
        expectedFirstMk1.shift()
        expectedFirstMk1.push({ score: 100, name: key1Mk1 })
        responses.push(await cache.sortedSet.getRankAscOrder(mainKey1, cache.grpcReadline))
        expect(responses[1].membersAndScore).toStrictEqual(expectedFirstMk1)
    })

    it("should get ranks in descending order", async () => {
        let responses = []
        responses.push(await cache.sortedSet.getRankDescOrder(mainKey1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankDescOrder(mainKey2, cache.grpcReadline))
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        let res = responses[0]
        let expectedFirstMk1 = [
            { score: 100, name: key1Mk1 },
            { score: value2Mk1, name: key2Mk1 },
            { score: value3Mk1, name: key3Mk1 },
        ]
        let expectedFirstMk2 = [
            { score: value1Mk2, name: key1Mk2 },
            { score: value3Mk2, name: key3Mk2 },
            { score: value2Mk2, name: key2Mk2 },
        ]
        expect(res.membersAndScore).toStrictEqual(expectedFirstMk1)
        res = responses[1]
        expect(res.membersAndScore).toStrictEqual(expectedFirstMk2)
        responses.push(await cache.sortedSet.insertToSortedSet(mainKey1, key1Mk1, 10, cache.grpcReadline))
        await new Promise((resolve) => setTimeout(() => { resolve(true) }, 100))
        responses.length = 0
        expectedFirstMk1.shift()
        expectedFirstMk1.push({ score: 10, name: key1Mk1 })
        responses.push(await cache.sortedSet.getRankDescOrder(mainKey1, cache.grpcReadline))
        res = responses[0]
        expect(res.membersAndScore).toStrictEqual(expectedFirstMk1)
    })

    it("should remove key inserted into the sorted set", async () => {
        let responses = []
        responses.push(await cache.sortedSet.getRankAscOrder(mainKey1, cache.grpcReadline))
        responses.push(await cache.sortedSet.removeFromSortedSet(mainKey1, key1Mk1, cache.grpcReadline))
        responses.push(await cache.sortedSet.getRankAscOrder(mainKey1, cache.grpcReadline))
        let res = responses[0]
        let expectedFirstMk1 = [
            { score: value1Mk1, name: key1Mk1 },
            { score: value3Mk1, name: key3Mk1 },
            { score: value2Mk1, name: key2Mk1 },
        ]
        expect(res.membersAndScore).toStrictEqual(expectedFirstMk1)
        res = responses[1]
        expect(res.result).toStrictEqual(1)
        expectedFirstMk1.shift()
        res = responses[2]
        expect(res.membersAndScore).toStrictEqual(expectedFirstMk1)
    })
})
