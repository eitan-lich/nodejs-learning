const EventEmitter = require("events");
const express = require("express");
const fs = require("fs").promises;
const WebSocket = require("ws");

const eventPusher = new EventEmitter();
const app = express();
const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", (ws: any) => {
    console.log("Got a new connection");
    ws.send("Hello from the server");


    ws.on("message", (message: any) => {
        console.log(`Got a message ${message}`);
    });

    ws.on("data", (data: any) => {
        console.log(`Got a data event ${data}`);
    });

    ws.on("close", () => {
        console.log("Web socket server closed");
    });
});




eventPusher.on("push", (data: any) => {
    console.log(`Got a push event ${data}`);
})

eventPusher.emit("push");

const logData = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Done")
        }, 5000);
    })
}

async function testPromises() {
    const promise = logData();
    console.log(promise)
    console.log("Skipped promise")
}

// testPromises();

const server = app.listen(8080, () => {
    console.log("Server listening at port 8080")
})

app.get("/downloadMe", async (req: any, res: any) => {
    const fileData = await fs.readFile("index.js");
    res.set("Content-Type", "yaml");
    res.end(fileData);

});

app.use("/", async (req: any, res: any) => {
    console.log("got request");
    const htmlPage = await fs.readFile("index.html");
    res.set("Content-Type", "text/html");
    res.send(htmlPage);
})