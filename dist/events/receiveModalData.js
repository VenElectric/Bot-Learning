"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ModalBuilder } = require("discord.js");
const { InteractionType } = require("discord.js");
module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(commands, interaction) {
        if (interaction.type !== InteractionType.ModalSubmit)
            return;
        if (interaction.customId === "initModal") {
            const { addSingle } = require("../services/database-common");
            const characterName = interaction.fields.getTextInputValue("characterName");
            const initiativeTotal = interaction.fields.getTextInputValue("initiativeTotal");
            const initiativeMod = interaction.fields.getTextInputValue("initiativeMod");
            await interaction.reply("Testing...thank you");
        }
        // addSingle(
        //     item: RecordObject,
        //     topLevelID: string,
        //     topLevelCollection: topLevelCollections,
        //     secondLevelCollection: secondLevelCollections
        //   ) {
        // const characterName = interaction.fields.getTextInputValue("characterName");
        // const initiativeTotal =
        //   interaction.fields.getTextInputValue("initiativeTotal");
        // const initiativeMod = interaction.fields.getTextInputValue("initiativeMod");
        // console.log(interaction.fields)
    },
};
