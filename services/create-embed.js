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
exports.rollEmbed = exports.createEmbed = void 0;
const { MessageEmbed } = require('discord.js');
const cemoj = ":bow_and_arrow:";
const bemoj = ":black_medium_square:";
const constants_1 = require("./constants");
function createEmbed(embedArray) {
    let embed = new MessageEmbed();
    console.log(embedArray, "embedArray");
    for (let record of embedArray) {
        console.log(record);
        embed.addField(constants_1.escapeChar, `${record.characterName}   |   ${record.isCurrent ? cemoj : bemoj}`, false);
    }
    embed.setTitle('Initiative List');
    return embed;
}
exports.createEmbed = createEmbed;
function rollEmbed(embedArray, tag) {
    return __awaiter(this, void 0, void 0, function* () {
        let embedFields = [];
        let embed = new MessageEmbed();
        for (let record of embedArray) {
            embedFields.push({ name: record.name, value: record.roll, inline: false });
        }
        embed.setTitle(`Embeds for the tag: ${tag}`);
        embed.addFields([...embedFields]);
        return embed;
    });
}
exports.rollEmbed = rollEmbed;
