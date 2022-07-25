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
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const database_common_1 = require("../services/database-common");
const uuid_1 = require("uuid");
const rpg_dice_roller_1 = require("@dice-roller/rpg-dice-roller");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("customroll")
        .setDescription("Create a custom roll")
        .addStringOption((option) => option
        .setName("roll")
        .setDescription("The dice to roll with any modifiers. I.E. d20+3")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("rollname")
        .setDescription("Name for custom roll")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const customRoll = interaction.options.getString("roll").toLowerCase();
            const rollName = interaction.options.getString("rollname");
            try {
                const tryRoll = new rpg_dice_roller_1.DiceRoll(customRoll);
            }
            catch (error) {
                interaction.channel.message(`Incorrect format for dice roll. Format should be the die to be rolled + any modifiers. I.E. d20+3 or 2d4+5. \n You tried to add: ${customRoll}`);
                return;
            }
            (0, database_common_1.addSingle)({ rollName: rollName, id: String((0, uuid_1.v4)()), rollValue: customRoll }, interaction.channel.id, ServerCommunicationTypes_1.topLevelCollections.SESSIONS, ServerCommunicationTypes_1.secondLevelCollections.ROLLS);
            weapon_of_logging.debug({
                message: "send to discord channel test",
                function: "ping",
            });
            interaction.reply("Custom Roll added successfully.");
        });
    },
};
