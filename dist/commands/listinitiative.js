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
// get session embed (initiative list in table format)
const { SlashCommandBuilder } = require("discord.js");
// import { webComponent, devWeb } from "../services/constants"
// const { hyperlink } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("listinitiative")
        .setDescription("Create an embed with the current initiative list."),
    description: 'Create an embed with the current initiative list.',
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.channel == null)
                return;
            const commandName = interaction.commandName;
            const sessionId = interaction.channel.id;
            try {
                sonic.emit("getInit", (init) => __awaiter(this, void 0, void 0, function* () {
                    const newList = yield init.retrieveCollection(sessionId);
                    const sortedList = init.resort(newList);
                    sonic.emit("getDiscordClient", (client) => __awaiter(this, void 0, void 0, function* () {
                        const initEmbed = client.initiativeEmbed(sortedList);
                        sonic.log("embed created for initiative", sonic.debug, commandName);
                        yield interaction.reply({ embeds: [initEmbed] });
                    }));
                }));
            }
            catch (error) {
                sonic.onError(error, commandName);
            }
        });
    },
};
