import * as net from "net"

const HOST = "127.0.0.1"
const PORT = 8002

const client = new net.Socket()

client.connect(PORT, HOST, () => {
    console.log(`Connected to server at ${HOST}:${PORT}`)
    let mapInsert = {
        messageType: 0,
        input: {
            key: "dynny key",
            value: "dummy value"
        }
    }
    client.write(JSON.stringify(mapInsert) + "\n")
})

client.on("data", (data) => {
    console.log("Received from server:", data.toString())
})

client.on("close", () => {
    console.log("Connection closed")
})

client.on("error", (err) => {
    console.error("Connection error:", err.message)
})

