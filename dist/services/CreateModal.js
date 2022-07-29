"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRecordModal = void 0;
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require("discord.js");
const builderObject = {};
function addRecordModal() {
    const infoModal = new ModalBuilder().setCustomId("initModal").setTitle("Add your initiative");
    // Character Name
    const characterName = new TextInputBuilder()
        .setCustomId("characterName")
        .setLabel("Character Name")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
    // Initiative (Total)
    const initiativeTotal = new TextInputBuilder()
        .setCustomId("initiativeTotal")
        .setLabel("Initiative Total (Dice + Modifier)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
    // Initiative Modifier
    const initiativeMod = new TextInputBuilder()
        .setCustomId("initiativeMod")
        .setLabel("Initiative Modifier")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
    const firstRow = new ActionRowBuilder().addComponents(characterName);
    const secondRow = new ActionRowBuilder().addComponents(initiativeTotal);
    const thirdRow = new ActionRowBuilder().addComponents(initiativeMod);
    infoModal.addComponents(firstRow, secondRow, thirdRow);
    return infoModal;
}
exports.addRecordModal = addRecordModal;
