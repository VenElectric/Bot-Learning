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
const { EmbedBuilder } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    name: "interactionCreate",
    once: false,
    execute(commands, sonic, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isSelectMenu())
                return;
            yield interaction.deferReply();
            try {
                if (interaction.customId === "helpmenu") {
                    const command = yield commands.get(interaction.values[0]);
                    if (command) {
                        const helpEmbed = new EmbedBuilder()
                            .setTitle(interaction.values[0])
                            .addFields({
                            name: "\u200b",
                            value: command.description,
                            inline: false,
                        });
                        yield interaction.editReply({
                            embeds: [helpEmbed],
                            components: [],
                        });
                    }
                }
                if (interaction.customId === "changechannel") {
                    let channelName = yield ((_a = interaction === null || interaction === void 0 ? void 0 : interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.fetch(interaction.values[0]));
                    yield interaction.editReply({
                        content: `Your channel has been changed to ${channelName === null || channelName === void 0 ? void 0 : channelName.name}`,
                        components: [],
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                    weapon_of_logging.alert({
                        message: error.message,
                        function: "interactioncreate for menus",
                    });
                    interaction.editReply({ content: "There was an error with this command", components: [] });
                    return;
                }
            }
        });
    },
};
