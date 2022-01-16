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
const LoggingClass_1 = require("../utilities/LoggingClass");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("changechannel")
        .setDescription("Change the channel of your game session."),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let menuChannels = [];
            try {
                let guildChannels = yield interaction.guild.channels.fetch();
                guildChannels.forEach((item) => {
                    if (item.type !== "GUILD_CATEGORY" && item.type !== "GUILD_VOICE") {
                        LoggingClass_1.weapon_of_logging.DEBUG("changechannel", "add in new channel to menu", { channelName: item.name, channelId: item.id });
                        menuChannels.push({
                            label: item.name,
                            value: item.id,
                        });
                    }
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    LoggingClass_1.weapon_of_logging.CRITICAL(error.name, "Uncaught error in changchannel", error.stack, error.message);
                }
            }
            const row = new MessageActionRow().addComponents(new MessageSelectMenu()
                .setCustomId("changechannel")
                .setPlaceholder("Nothing selected")
                .addOptions(menuChannels));
            LoggingClass_1.weapon_of_logging.INFO("changechannel", "Replying to interaction with created select menu", "none");
            yield interaction.reply({
                content: "Select a new channel for your session.",
                components: [row],
            });
        });
    },
};
