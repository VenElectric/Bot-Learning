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
const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("getdicerolls")
        .setDescription("Retrieve up to the last 50 dice rolls"),
    description: "Get the most recent dice rolls from this chat log.",
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.channel == null)
                return;
            const sessionId = interaction.channel.id;
            const commandName = interaction.commandName;
            try {
                sonic.emit("getDice", (roller) => __awaiter(this, void 0, void 0, function* () {
                    const diceLogs = yield roller.getDiceLogs(sessionId);
                    const editedLogs = diceLogs.slice(-10);
                    const limit = editedLogs.length;
                    sonic.emit("getDiscordClient", (client) => __awaiter(this, void 0, void 0, function* () {
                        const embed = client.diceLogEmbed(editedLogs, limit);
                        yield interaction.reply({
                            content: "",
                            embeds: [embed],
                            ephemeral: true,
                        });
                    }));
                }));
            }
            catch (error) {
                sonic.onError(error, commandName);
            }
        });
    },
};
