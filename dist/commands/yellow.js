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
const { ConsentCards } = require("../services/constants");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("yellow")
        .setDescription("Use if you are feeling uncomfortable and need things to slow down."),
    description: "Use if you are feeling uncomfortable and need things to slow down.",
    execute(ccommands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.command == null)
                return;
            const commandName = interaction.command.name;
            try {
                sonic.emit("getDiscordClient", (client) => __awaiter(this, void 0, void 0, function* () {
                    const { embed, file } = client.consentCardEmbed(ConsentCards.YELLOW, interaction.user.username);
                    yield interaction.reply({
                        content: "@here",
                        embeds: [embed],
                        files: [file],
                    });
                }));
            }
            catch (error) {
                sonic.onError(error, commandName);
            }
        });
    },
};
