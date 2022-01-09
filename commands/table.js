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
const { SlashCommandBuilder } = require("@discordjs/builders");
// import { webComponent, devWeb } from "../services/constants"
// const { hyperlink } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("table")
        .setDescription("Get the link for the web component."),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply("Website is down for maintenance!");
            // let url = `${devWeb}/session/${interaction.channel.id}`
            // await interaction.reply(`Here is the URL for your session: ${url} \nThis URL is specific to this channel. If you need to change the session to a different text channel then please use the /changechannel slash command.`);
        });
    },
};
