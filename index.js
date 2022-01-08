"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const express = require("express");
const { token } = require("./config.json");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
const { register_commands } = require("./deploy-commands");
const constants_1 = require("./services/constants");
const database_common_1 = require("./services/database-common");
require("dotenv").config();
const io = require("socket.io")(server, {
    cors: {
        origin: process.env.HOST_URL,
        methods: ["GET", "POST"],
    },
});
app.use(require("cors")({
    origin: process.env.HOST_URL,
    methods: ["GET", "POST"],
}));
console.log(process.env.HOST_URL);
app.use(express.json());
// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});
client.commands = new Collection();
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}
// ----- DISCORD ------
// When the client is ready, run this code (only once)
client.once("ready", () => {
    console.log("Ready");
});
// Login to Discord with your client"s token
register_commands();
client.login(token);
io.on("connection", (socket) => {
    socket.on("create", function (room) {
        socket.join(room);
        console.log(room);
    });
    socket.on("test", function (data) {
        console.log("data", data);
    });
    socket.on("getinitial", (sessionId, respond) => __awaiter(void 0, void 0, void 0, function* () {
        let initiativeList = yield (0, database_common_1.retrieveCollection)(sessionId, constants_1.initiativeCollection);
        let spellList = yield (0, database_common_1.retrieveCollection)(sessionId, constants_1.spellCollection);
        let [isSorted, onDeck] = yield (0, database_common_1.getSession)(sessionId);
        respond({
            initiativeList: initiativeList,
            spellList: spellList,
            isSorted: isSorted,
            onDeck: onDeck,
            sessionId,
        });
    }));
    socket.on("addinit", (sessionId, respond) => {
        respond("test");
    });
});
client.on("error", (error) => {
    if (error instanceof Error) {
        console.log(error);
        console.log("client.on");
    }
});
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    const regex = new RegExp(/(\/|\/[a-z]|\/[A-Z]|r)*\s*([d|D])([\d])+/);
    const numreg = new RegExp(/(^\d\s*(\*|\+|\-|\/|=)\s*(\d|[a-z]))/);
    // const prefix = new RegExp(/\/[a-z]|\/|[r|R]/);
    const rollcom = client.commands.get("roll");
    const mathcom = client.commands.get("maths");
    if (message.author.bot)
        return;
    try {
        if (message.content.match(regex)) {
            rollcom.execute(message);
        }
        if (!message.content.match(regex) && message.content.match(numreg)) {
            mathcom.execute(message);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            message.channel.send(error.message);
        }
    }
}));
// Menu interactions
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!interaction.isSelectMenu())
        return;
    // help menu
    if (interaction.customId === "helpmenu") {
        yield interaction.deferUpdate();
        const helpEmbed = new MessageEmbed()
            .setTitle(interaction.values[0])
            .addField("\u200b", constants_1.commandDescriptions[`${interaction.values[0]}`].description, false)
            .setImage(constants_1.commandDescriptions[`${interaction.values[0]}`].image);
        yield interaction.editReply({
            embeds: [helpEmbed],
            components: [],
        });
    }
    if (interaction.customId === "changechannel") {
        let channelName = yield ((_a = interaction === null || interaction === void 0 ? void 0 : interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.fetch(interaction.values[0]));
        yield interaction.deferUpdate();
        yield interaction.editReply({
            content: `Your channel has been changed to ${channelName === null || channelName === void 0 ? void 0 : channelName.name}`,
            components: [],
        });
    }
}));
// Command Interactions
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand()) {
        return;
    }
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        return;
    }
    try {
        yield command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        yield interaction.reply({
            content: "There was an error while executing this command!",
        });
    }
}));
// ----- ROUTES ------
app.get("/dungeon-bot/api/sessions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    console.log(res);
    console.log("test");
    // get session list
}));
server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
