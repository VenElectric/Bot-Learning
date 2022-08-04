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
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord.js');
const path = require("path");
require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;
function register_commands() {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = [];
        const commandsPath = path.join(__dirname, "commands");
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            commands.push(command.data.toJSON());
        }
        const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
        switch (process.env.ENVIRONMENT) {
            case "DEVELOPMENT":
                console.log("development");
                yield rest
                    .put(Routes.applicationGuildCommands(clientId, guildID), {
                    body: commands,
                })
                    .then(() => console.log("Successfully registered application commands."))
                    .catch(console.error);
                break;
            default:
                console.log("default");
                yield rest
                    .put(Routes.applicationCommands(clientId), { body: commands })
                    .then(() => console.log("Successfully registered application commands."))
                    .catch(console.error);
                break;
        }
    });
}
module.exports = { register_commands };
