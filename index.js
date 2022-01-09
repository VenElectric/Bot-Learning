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
exports.client = void 0;
const fs = require("fs");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
const { register_commands } = require("./deploy-commands");
const constants_1 = require("./services/constants");
const database_common_1 = require("./services/database-common");
const initiative_1 = require("./services/initiative");
const emitTypes_1 = require("./services/emitTypes");
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
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
exports.client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});
exports.client.commands = new Collection();
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    exports.client.commands.set(command.data.name, command);
}
// ----- DISCORD ------
// When the client is ready, run this code (only once)
exports.client.once("ready", () => {
    console.log("Ready");
});
// Login to Discord with your client"s token
register_commands();
exports.client.login(token);
io.on("connection", (socket) => {
    socket.on("create", function (room) {
        socket.join(room);
        console.log(room);
    });
    socket.on("test", function (data) {
        console.log("data", data);
    });
    socket.on("GET_INITIAL_INIT", (sessionId, respond) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("GET_INITIAL_INIT");
        let initiativeList = yield (0, database_common_1.retrieveCollection)(sessionId, constants_1.initiativeCollection);
        let [isSorted, onDeck, sessionSize] = yield (0, database_common_1.getSession)(sessionId);
        console.log(isSorted, onDeck, sessionSize);
        respond({
            initiativeList: initiativeList,
            spellList: [],
            isSorted: isSorted,
            onDeck: onDeck,
            sessionId,
        });
    }));
    socket.on("GET_INITIAL_SPELLS", (sessionId, respond) => __awaiter(void 0, void 0, void 0, function* () {
        let spellList = yield (0, database_common_1.retrieveCollection)(sessionId, constants_1.spellCollection);
        console.log("get initial spells");
        respond(spellList);
    }));
    socket.on(emitTypes_1.EmitTypes.CREATE_NEW, (dataList, respond) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(dataList);
        let response;
        try {
            yield (0, database_common_1.addSingle)(dataList.payload, dataList.sessionId, dataList.collectionType);
            console.log("success");
            response = 200;
        }
        catch (error) {
            console.log(error);
            response = error;
        }
        respond(response);
    }));
    socket.on(emitTypes_1.EmitTypes.ROUND_START, (sessionId, respond) => __awaiter(void 0, void 0, void 0, function* () {
        let initiativeList = yield (0, database_common_1.retrieveCollection)(sessionId, constants_1.initiativeCollection);
        let [isSorted, onDeck, sessionSize] = yield (0, database_common_1.getSession)(sessionId);
        let sortedList = yield (0, initiative_1.finalizeInitiative)(initiativeList, true, sessionId, onDeck, isSorted);
        socket.broadcast.to(sessionId).emit(emitTypes_1.EmitTypes.ROUND_START, { initiativeList: sortedList, isSorted: isSorted, sessionSize: sessionSize, onDeck: onDeck });
        respond({ initiativeList: sortedList, isSorted: isSorted, sessionSize: sessionSize, onDeck: onDeck });
    }));
    socket.on("addinit", (sessionId, respond) => {
        respond("test");
    });
});
exports.client.on("error", (error) => {
    if (error instanceof Error) {
        console.log(error);
        console.log("client.on");
    }
});
exports.client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    const regex = new RegExp(/(\/|\/[a-z]|\/[A-Z]|r)*\s*([d|D])([\d])+/);
    const numreg = new RegExp(/(^\d\s*(\*|\+|\-|\/|=)\s*(\d|[a-z]))/);
    // const prefix = new RegExp(/\/[a-z]|\/|[r|R]/);
    const rollcom = exports.client.commands.get("roll");
    const mathcom = exports.client.commands.get("maths");
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
exports.client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand()) {
        return;
    }
    const command = exports.client.commands.get(interaction.commandName);
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
server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
