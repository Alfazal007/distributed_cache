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
