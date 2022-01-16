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
const constants_1 = require("../services/constants");
const LoggingClass_1 = require("../utilities/LoggingClass");
const wait = require('util').promisify(setTimeout);
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help with commands"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = new MessageActionRow().addComponents(new MessageSelectMenu()
                .setCustomId("helpmenu")
                .setPlaceholder("Nothing selected")
                .addOptions(constants_1.helpMenu));
            LoggingClass_1.weapon_of_logging.INFO("help", "sending helpmenu to channel", "none");
            yield interaction.reply({ content: "Select a command", components: [row] });
        });
    },
};
