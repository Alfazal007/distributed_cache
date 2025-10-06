import { connect } from "@itachi__uchiha/distcachelibrary"

async function main() {
    const distCache = connect("127.0.0.1")
    const queueKey = "queueKey"
    const value1 = "firstValue"
    const value2 = "secondValueQueue"
    distCache.tcpQueue.subscribeToQueue(queueKey)
    let listener1 = distCache.tcpQueue.getQueueMessageIncoming(queueKey, distCache.tcpReadline)
    await distCache.queue.insertFrontOfQueue(queueKey, value1, distCache.grpcReadline)
    let r1 = await listener1
    let listener2 = distCache.tcpQueue.getQueueMessageIncoming(queueKey, distCache.tcpReadline)
    await distCache.queue.insertFrontOfQueue(queueKey, value2, distCache.grpcReadline)
    let r2 = await listener2
    const decodedR1 = Buffer.from(r1, "base64").toString("utf-8")
    const decodedR2 = Buffer.from(r2, "base64").toString("utf-8")
    console.log({ decodedR1 })
    console.log({ decodedR2 })
    distCache.disconnect()
}

main()

