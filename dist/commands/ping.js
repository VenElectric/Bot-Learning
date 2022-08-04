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
const discord_js_1 = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    description: "Test Command",
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const row = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions({
                    label: 'Select me',
                    description: 'This is a description',
                    value: 'first_option',
                }, {
                    label: 'You can select me too',
                    description: 'This is also a description',
                    value: 'second_option',
                }));
            }
            catch (error) {
                console.log(error, "ping function");
            }
            finally {
                yield interaction.reply("Thank you for testing");
            }
        });
    },
};
