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
exports.consentCardEmbed = exports.baseEmbed = exports.rollEmbed = exports.statusEmbed = exports.spellEmbed = exports.initiativeEmbed = void 0;
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const cemoj = ":bow_and_arrow:";
const bemoj = ":black_medium_square:";
const constants_1 = require("./constants");
function initiativeEmbed(embedArray) {
    let embed = new EmbedBuilder();
    console.log(embedArray, "embedArray");
    for (let record of embedArray) {
        embed.addFields({
            name: constants_1.escapeChar,
            value: `${record.characterName}   |   ${record.isCurrent ? cemoj : bemoj}`,
            inline: false,
        });
    }
    embed.setTitle("Initiative List");
    return embed;
}
exports.initiativeEmbed = initiativeEmbed;
function spellEmbed(embedArray) {
    let embed = new EmbedBuilder();
    for (let record of embedArray) {
        embed.addFields({
            name: record.effectName,
            value: record.effectDescription,
            inline: false,
        });
    }
    embed.setTitle("Spells/Effects List");
    return embed;
}
exports.spellEmbed = spellEmbed;
// too much spacing
function statusEmbed(character, statusArray) {
    const embed = new EmbedBuilder();
    embed.setTitle(`Current Turn: ${character}`);
    if (statusArray.length > 0) {
        embed.addFields({
            name: `Effects`,
            value: constants_1.escapeChar,
            inline: false,
        });
        for (let record of statusArray) {
            embed.addField({
                name: constants_1.escapeChar,
                value: record.spellName,
                inline: false,
            });
        }
    }
    else {
        embed.addField(`Effects`, "None");
    }
    return embed;
}
exports.statusEmbed = statusEmbed;
function rollEmbed(embedArray, tag) {
    return __awaiter(this, void 0, void 0, function* () {
        let embedFields = [];
        let embed = new EmbedBuilder();
        for (let record of embedArray) {
            embedFields.push({ name: record.name, value: record.roll, inline: false });
        }
        embed.setTitle(`Embeds for the tag: ${tag}`);
        embed.addFields([...embedFields]);
        return embed;
    });
}
exports.rollEmbed = rollEmbed;
function baseEmbed(title) {
    return new EmbedBuilder().setTitle(title);
}
exports.baseEmbed = baseEmbed;
function consentCardEmbed(color, userName) {
    const file = new AttachmentBuilder(`./dist/images/${color.value}.png`).setDescription(color.name);
    const embed = new EmbedBuilder()
        .setTitle(`${color.name} being flagged by ${userName}`)
        .setColor(color.value)
        .setDescription(color.description)
        .setImage(`attachment://${color.value}.png`)
        .setTimestamp();
    return { embed: embed, file: file };
}
exports.consentCardEmbed = consentCardEmbed;
