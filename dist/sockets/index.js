"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Collection } = require("discord.js");
const socket_io_1 = require("socket.io");
const BaseClass_1 = __importDefault(require("../utilities/BaseClass"));
const path = require("node:path");
const fs = require("node:fs");
const weapon_of_logging = require("../utilities/LoggerConfig");
require("dotenv").config();
// <ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
class IOConnection extends BaseClass_1.default {
    constructor(server, sonic) {
        super(sonic);
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.HOST_URL,
                methods: ["GET", "POST"],
            },
        });
        this.registerSockets = new Collection();
    }
    initRegisterSockets() {
        const socketsPath = path.join(__dirname);
        const socketsFolders = fs.readdirSync(socketsPath);
        for (const folder of socketsFolders) {
            if (folder.includes("util") ||
                folder.includes("types") ||
                folder.includes("index"))
                continue;
            const filePath = path.join(socketsPath, folder);
            const socketsFiles = fs
                .readdirSync(filePath)
                .filter((file) => file.endsWith(".js"));
            for (const file of socketsFiles) {
                const filePath = path.join(socketsPath, folder, file);
                const socketEvent = require(filePath);
                this.registerSockets.set(socketEvent.name, socketEvent);
            }
        }
    }
    onConnection(socket) {
        socket.on("create", function (room) {
            socket.join(room);
            weapon_of_logging.info({ message: "room joined", function: "create" });
        });
        for (const record of this.registerSockets) {
            const socketRecord = this.registerSockets.get(record[0]);
            socket.on(socketRecord.name, (...args) => socketRecord.execute(socket, this.sonic, ...args));
        }
    }
    init() {
        this.initRegisterSockets();
        this.io.on("connection", this.onConnection);
    }
}
exports.default = IOConnection;
