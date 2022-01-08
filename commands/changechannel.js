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
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("changechannel")
        .setDescription("Change the channel of your game session."),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let menuChannels = [];
            let guildChannels = yield interaction.guild.channels.fetch();
            // console.log(guildChannels);
            guildChannels.forEach((item) => {
                if (item.type !== "GUILD_CATEGORY" && item.type !== "GUILD_VOICE") {
                    menuChannels.push({
                        label: item.name,
                        value: item.id,
                    });
                }
            });
            const row = new MessageActionRow().addComponents(new MessageSelectMenu()
                .setCustomId("changechannel")
                .setPlaceholder("Nothing selected")
                .addOptions(menuChannels));
            // transfer docs or use UUID for doc id (like we were doing)
            yield interaction.reply({
                content: "Select a new channel for your session.",
                components: [row],
            });
        });
    },
};
