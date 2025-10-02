import * as net from "net"

const HOST = "127.0.0.1"
function connectToGrpc() {
    const PORT = 8002
    const client = new net.Socket()
    client.connect(PORT, HOST, () => {
        console.log(`Connected to server at ${HOST}:${PORT}`)
        let mapInsert = {
            messageType: 0,
            input: {
                key: "dynny key",
                value: "dummy value"
            },
            key: "dynny key",
        }
        client.write(JSON.stringify(mapInsert) + "\n")
        let mapGet = {
            messageType: 1,
            input: {
                key: "dynny key",
            },
            key: "dynny key",
        }
        client.write(JSON.stringify(mapGet) + "\n")

        setTimeout(() => {
            function sendData(i: number) {
                let mapInsert = {
                    messageType: 3,
                    input: {
                        key: "dynny key",
                        value: Buffer.from(`dummy value zehahahaha ${i}`).toString('base64')
                    },
                    key: "dynny key",
                }
                client.write(JSON.stringify(mapInsert) + "\n")
            }
            for (let i = 0; i < 10; i++) {
                sendData(i)
            }
        }, 10000)
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
}

function connectToTcp() {
    const PORT = 8003
    const client = new net.Socket()
    client.connect(PORT, HOST, () => {
        console.log(`Connected to server at ${HOST}:${PORT}`)
        let mapInsert = {
            messageType: 0,
            key: "dynny key",
            subscribe: true,
        }
        setTimeout(() => {
            console.log("sending subscribe message")
            client.write(JSON.stringify(mapInsert) + "\n")
        }, 2000)
    })

    client.on("data", (data) => {
        console.log("Received from tcp server:", data.toString())
    })

    client.on("close", () => {
        console.log("Connection closed")
    })

    client.on("error", (err) => {
        console.error("Connection error:", err.message)
    })
}

connectToGrpc()
connectToTcp()

