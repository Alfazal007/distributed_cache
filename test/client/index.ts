import * as net from "net";
import * as readline from "readline";

const client = net.createConnection(8080, "127.0.0.1", () => {
    console.log("Connected to server");
});

const messages: string[] = [];

const rl = readline.createInterface({
    input: client,
    crlfDelay: Infinity,
});

rl.on("line", (line: string) => {
    messages.push(line);
    console.log("Received message:", line);
});

client.on("close", () => {
    console.log("Connection closed");
    console.log("All messages received:", messages);
});

client.on("error", (err) => {
    console.error("Error:", err.message);
});

type GrpcRequest = {
    id: string;
    messageType: string;
    input?: any;
    [key: string]: any;
};

export class GrpcHelper {
    constructor(
        private rl: readline.Interface,
        private client: net.Socket
    ) { }

    private makeRequest<T = any>(msg: Omit<GrpcRequest, "id">): Promise<T> {
        return new Promise((resolve, reject) => {
            const id = Date.now().toString() + Math.random();
            const request: GrpcRequest = { id, ...msg };

            const onLine = (line: string) => {
                try {
                    const response = JSON.parse(line);
                    if (response.id === id) {
                        resolve(response as T);
                    } else {
                        // Not our response, re-attach listener
                        this.rl.once("line", onLine);
                    }
                } catch (err) {
                    reject(err);
                }
            };

            this.rl.once("line", onLine);
            this.client.write(JSON.stringify(request) + "\n");
        });
    }

    // Example wrappers for your 30 functions:

    insertToHashMap(key: string, value: string) {
        return this.makeRequest({
            messageType: "MapInsert",
            input: { key, value },
            key,
        });
    }

    getFromHashMap(key: string) {
        return this.makeRequest({
            messageType: "MapGet",
            input: { key },
            key,
        });
    }

    deleteFromHashMap(key: string) {
        return this.makeRequest({
            messageType: "MapDelete",
            input: { key },
            key,
        });
    }

    // ... add other methods following the same pattern
}

async function insertToHashMap(
    rl: readline.Interface,
    client: net.Socket,
    key: string,
    value: string
): Promise<any> {
    return new Promise((resolve, reject) => {
        const requestId = Date.now().toString() + Math.random()
        const msg = {
            id: requestId,
            messageType: "MapInsert",
            input: { key, value },
            key,
        };
        // one-time listener
        const onLine = (line: string) => {
            try {
                const response = JSON.parse(line);
                if (response.id === requestId) {
                    resolve(response);
                } else {
                    // not my response → reattach listener
                    rl.once("line", onLine);
                }
            } catch (err) {
                reject(err);
            }
        };
        rl.once("line", onLine);
        client.write(JSON.stringify(msg) + "\n");
    });
}
