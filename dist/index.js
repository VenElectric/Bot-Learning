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
exports.ioClass = exports.commands = exports.client = exports.spell = exports.dice = exports.initDB = exports.clientClass = exports.redisStore = exports.sonic = void 0;
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const SelectMenuItemsCreation_1 = require("./services/SelectMenuItemsCreation");
const DiscordClient_1 = __importDefault(require("./discord/DiscordClient"));
const index_1 = require("./serverevents/index");
const RedisStore_1 = __importDefault(require("./data/redis/RedisStore"));
const Initiative_1 = __importDefault(require("./utilities/gamesession/Initiative"));
const index_2 = __importDefault(require("./sockets/index"));
const Dice_1 = __importDefault(require("./utilities/gamesession/Dice"));
const Spells_1 = __importDefault(require("./utilities/gamesession/Spells"));
const weapon_of_logging = require("./utilities/LoggerConfig").logger;
require("dotenv").config();
app.use(require("cors")({
    origin: process.env.HOST_URL,
    methods: ["GET", "POST"],
}));
app.use(express.json());
exports.sonic = new index_1.base();
exports.sonic.init();
exports.redisStore = new RedisStore_1.default(exports.sonic);
exports.redisStore.init();
exports.clientClass = new DiscordClient_1.default(exports.sonic);
exports.clientClass.init();
exports.initDB = new Initiative_1.default(exports.sonic);
exports.dice = new Dice_1.default(exports.sonic);
exports.spell = new Spells_1.default(exports.sonic);
// remove these. sonic should only be retrieving them.
exports.client = exports.clientClass.getClient();
exports.commands = exports.clientClass.getCommands();
// remove this. make sure nowhere is using it :)
(0, SelectMenuItemsCreation_1.initCollection)(exports.commands);
exports.ioClass = new index_2.default(server, exports.sonic);
exports.ioClass.init();
// Register and create necessary items
// Login
exports.client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Ready");
    weapon_of_logging.debug({ message: "ready" });
}));
// Error catching
let isBlocked = false;
process.on("unhandledRejection", (error) => {
    if (error instanceof Error) {
        if (!isBlocked) {
            const channelID = process.env.MY_DISCORD;
            exports.client.channels.fetch(channelID).then((channel) => {
                channel.send(`Unhandled Rejection ${error.message} `);
            });
            console.log(error);
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
process.on("uncaughtException", (err) => __awaiter(void 0, void 0, void 0, function* () {
    weapon_of_logging.warning({
        message: `Uncaught Promise Exception: ${err.message}`,
        function: err.stack,
    });
    console.error("Uncaught Promise Exception:\n", err);
}));
process.on("uncaughtExceptionMonitor", (err) => __awaiter(void 0, void 0, void 0, function* () {
    weapon_of_logging.warning({
        message: `Uncaught Promise Exception (Monitor): ${err.message}`,
        function: err.stack,
    });
    console.error("Uncaught Promise Exception (Monitor):\n", err);
}));
server.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
