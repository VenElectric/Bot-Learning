"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.io = void 0;
const fs = require("node:fs");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const { register_commands } = require("./deploy-commands");
const weapon_of_logging = require("./utilities/LoggerConfig").logger;
const path = require("node:path");
const db = require("./services/database-common");
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
// Create a new client instance
exports.client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});
// client.commands = new Collection();
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
        exports.client.once(event.name, (...args) => event.execute(commands, ...args));
    }
    else {
        exports.client.on(event.name, (...args) => event.execute(commands, ...args));
    }
}
exports.client.login(token);
// ----- DISCORD ------
exports.client.once("ready", async () => {
    console.log("Ready");
    weapon_of_logging.debug({ message: "ready" });
});
register_commands();
exports.client.login(token);
let isBlocked = false;
process.on("unhandledRejection", (error) => {
    if (error instanceof Error) {
        if (!isBlocked) {
            exports.client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
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
const registerSockets = new Collection();
const socketsPath = path.join(__dirname, "sockets");
const socketsFolders = fs.readdirSync(socketsPath);
for (const folder of socketsFolders) {
    if (folder.includes("util"))
        continue;
    const filePath = path.join(socketsPath, folder);
    const socketsFiles = fs
        .readdirSync(filePath)
        .filter((file) => file.endsWith(".js"));
    for (const file of socketsFiles) {
        if (file.includes("types"))
            continue;
        const filePath = path.join(socketsPath, folder, file);
        const socketEvent = require(filePath);
        registerSockets.set(socketEvent.name, socketEvent);
    }
}
const onConnection = (socket) => {
    socket.on("create", function (room) {
        socket.join(room);
        console.log(room);
        weapon_of_logging.info({ message: "room joined", function: "create" });
    });
    for (const record of registerSockets) {
        const socketRecord = registerSockets.get(record[0]);
        socket.on(socketRecord.name, (...args) => socketRecord.execute(exports.io, socket, exports.client, ...args));
    }
};
exports.io.on("connection", onConnection);
// io.on("connection", (socket: Socket) => {
//   socket.on("create", function (room: any) {
//     socket.join(room);
//     weapon_of_logging.info({ message: "room joined", function: "create" });
//   });
//   // initiativeSocket(socket, client, io);
//   spellSocket(socket, client, io);
//   rollSocket(socket, client, io);
//   loggingSocket(socket);
// });
// Command Interactions
// client.on("interactionCreate", async (interaction: BaseCommandInteraction) => {
//   if (!interaction.isCommand()) {
//     return;
//   }
//   const command = client.commands.get(interaction.commandName);
//   if (!command) {
//     return;
//   }
//   try {
//     await command.execute(interaction);
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log(error);
//       weapon_of_logging.warning({
//         message: error.message,
//         function: "interactioncreate for slash commands",
//       });
//     }
//     await interaction.reply({
//       content: "There was an error while executing this command!",
//     });
//   }
// });
app.get("/api/users/character", async (req, res) => {
    console.log(req.body.data);
    res.json("test");
});
app.get("/api/users/character/list", async (req, res) => {
    console.log(req.body.data);
    res.json("test");
});
app.post("/api/users/character", async (req, res) => { });
server.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
