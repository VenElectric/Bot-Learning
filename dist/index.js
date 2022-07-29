"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const fs = require("node:fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const { register_commands } = require("./deploy-commands");
const discord_js_1 = require("discord.js");
const weapon_of_logging = require("./utilities/LoggerConfig").logger;
const path = require("node:path");
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
exports.io = require("socket.io")(server, {
    cors: {
        origin: process.env.HOST_URL,
        methods: ["GET", "POST"],
    },
});
app.use(require("cors")({
    origin: process.env.HOST_URL,
    methods: ["GET", "POST"],
}));
app.use(express.json());
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [discord_js_1.Partials.Channel],
});
const commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    commands.set(command.data.name, command);
}
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(commands, ...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(commands, ...args));
    }
}
// ----- DISCORD ------
client.once("ready", async () => {
    console.log("Ready");
    weapon_of_logging.debug({ message: "ready" });
});
register_commands();
client.login(token);
let isBlocked = false;
process.on("unhandledRejection", (error) => {
    if (error instanceof Error) {
        if (!isBlocked) {
            client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
                channel.send(`Unhandled Rejection ${error.message} `);
            });
            isBlocked = true;
            setTimeout(() => {
                isBlocked = false;
            }, 300000);
        }
        else {
            return;
        }
    }
});
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Promise Exception:\n", err);
});
process.on("uncaughtExceptionMonitor", async (err) => {
    console.error("Uncaught Promise Exception (Monitor):\n", err);
});
// process.on("multipleResolves", async (type, promise, reason) => {
//   console.error("Multiple Resolves:\n", type, promise, reason);
// });
const registerSockets = new Collection();
const socketsPath = path.join(__dirname, "sockets");
const socketsFolders = fs.readdirSync(socketsPath);
for (const folder of socketsFolders) {
    if (folder.includes("util") || folder.includes("types"))
        continue;
    const filePath = path.join(socketsPath, folder);
    const socketsFiles = fs
        .readdirSync(filePath)
        .filter((file) => file.endsWith(".js"));
    for (const file of socketsFiles) {
        const filePath = path.join(socketsPath, folder, file);
        const socketEvent = require(filePath);
        registerSockets.set(socketEvent.name, socketEvent);
    }
}
const onConnection = (socket) => {
    socket.on("create", function (room) {
        socket.join(room);
        weapon_of_logging.info({ message: "room joined", function: "create" });
    });
    for (const record of registerSockets) {
        const socketRecord = registerSockets.get(record[0]);
        socket.on(socketRecord.name, (...args) => socketRecord.execute(exports.io, socket, client, ...args));
    }
};
exports.io.on("connection", onConnection);
// app.get("/api/users/character", async (req: Request, res: Response) => {
//   console.log(req.body.data);
//   res.json("test");
// });
// app.get("/api/users/character/list", async (req: Request, res: Response) => {
//   console.log(req.body.data);
//   res.json("test");
// });
// app.post("/api/users/character", async (req: Request, res: Response) => {});
server.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
