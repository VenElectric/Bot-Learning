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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const initiative_1 = __importDefault(require("./services/sockets/initiative"));
const spells_1 = __importDefault(require("./services/sockets/spells"));
const logging_1 = __importDefault(require("./services/sockets/logging"));
const roll_1 = __importDefault(require("./services/sockets/roll"));
const constants_1 = require("./services/constants");
const weapon_of_logging = require("./utilities/LoggerConfig").logger;
const path = require("node:path");
console.log(process.cwd());
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
exports.client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    exports.client.commands.set(command.data.name, command);
}
// ----- DISCORD ------
exports.client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Ready");
    weapon_of_logging.debug({ message: "ready" });
}));
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
exports.io.on("connection", (socket) => {
    socket.on("create", function (room) {
        socket.join(room);
        weapon_of_logging.info({ message: "room joined", function: "create" });
    });
    (0, initiative_1.default)(socket, exports.client, exports.io);
    (0, spells_1.default)(socket, exports.client, exports.io);
    (0, roll_1.default)(socket, exports.client, exports.io);
    (0, logging_1.default)(socket);
});
var eventTypes;
(function (eventTypes) {
    eventTypes["messageCreate"] = "messageCreate";
})(eventTypes || (eventTypes = {}));
exports.client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    const regex = new RegExp(/(\/|\/[a-z]|\/[A-Z]|r)*\s*([d|D])([\d])+/);
    const numreg = new RegExp(/([-+]?[0-9]*\.?[0-9]+[\/\+\-\*])+([-+]?[0-9]*\.?[0-9]+)/);
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
            weapon_of_logging.alert({
                message: error.message,
                function: "messagecreate",
            });
            return;
        }
    }
}));
// Menu interactions
exports.client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!interaction.isSelectMenu())
        return;
    try {
        if (interaction.customId === "helpmenu") {
            yield interaction.deferUpdate();
            const helpEmbed = new MessageEmbed()
                .setTitle(interaction.values[0])
                .addField("\u200b", constants_1.commandDescriptions[`${interaction.values[0]}`].description, false)
                .setImage(constants_1.commandDescriptions[`${interaction.values[0]}`].image);
            console.log(helpEmbed);
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
    }
    catch (error) {
        if (error instanceof Error) {
            weapon_of_logging.alert({
                message: error.message,
                function: "interactioncreate for menus",
            });
            return;
        }
    }
    // help menu
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
        if (error instanceof Error) {
            console.log(error);
            weapon_of_logging.warning({
                message: error.message,
                function: "interactioncreate for slash commands",
            });
        }
        yield interaction.reply({
            content: "There was an error while executing this command!",
        });
    }
}));
app.get("/api/users/character", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.data);
    res.json("test");
}));
app.get("/api/users/character/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.data);
    res.json("test");
}));
app.post("/api/users/character", (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
server.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
