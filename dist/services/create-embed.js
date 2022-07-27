"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollEmbed = exports.statusEmbed = exports.spellEmbed = exports.initiativeEmbed = void 0;
const { MessageEmbed } = require("discord.js");
const cemoj = ":bow_and_arrow:";
const bemoj = ":black_medium_square:";
const constants_1 = require("./constants");
function initiativeEmbed(embedArray) {
    let embed = new MessageEmbed();
    console.log(embedArray, "embedArray");
    for (let record of embedArray) {
        embed.addField(constants_1.escapeChar, `${record.characterName}   |   ${record.isCurrent ? cemoj : bemoj}`, false);
    }
    embed.setTitle("Initiative List");
    return embed;
}
exports.initiativeEmbed = initiativeEmbed;
function spellEmbed(embedArray) {
    let embed = new MessageEmbed();
    for (let record of embedArray) {
        embed.addField(record.effectName, record.effectDescription, false);
    }
    embed.setTitle("Spells/Effects List");
    return embed;
}
exports.spellEmbed = spellEmbed;
// too much spacing
function statusEmbed(character, statusArray) {
    const embed = new MessageEmbed();
    embed.setTitle(`Current Turn: ${character}`);
    if (statusArray.length > 0) {
        embed.addField(`Effects`, constants_1.escapeChar);
        for (let record of statusArray) {
            embed.addField(constants_1.escapeChar, record.spellName);
        }
    }
    else {
        embed.addField(`Effects`, "None");
    }
    return embed;
}
exports.statusEmbed = statusEmbed;
async function rollEmbed(embedArray, tag) {
    let embedFields = [];
    let embed = new MessageEmbed();
    for (let record of embedArray) {
        embedFields.push({ name: record.name, value: record.roll, inline: false });
    }
    embed.setTitle(`Embeds for the tag: ${tag}`);
    embed.addFields([...embedFields]);
    return embed;
}
exports.rollEmbed = rollEmbed;
