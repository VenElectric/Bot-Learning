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
const { v4: uuidv4 } = require("uuid");
const database_common_1 = require("../services/database-common");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const index_1 = require("../index");
const ServerCommunicationTypes_2 = require("../Interfaces/ServerCommunicationTypes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addchar")
        .setDescription("Enter your initiative.")
        .addStringOption((option) => option
        .setName("charactername")
        .setDescription("Enter Character Name")
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("initiativeroll")
        .setDescription("Enter Initiative Dice Roll (NO MODIFIER ADDED)")
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("initiativemodifier")
        .setDescription("Enter Initiative Modifier")
        .setRequired(true))
        .addBooleanOption((option) => option
        .setName("isnpc")
        .setDescription("NPC? True or False")
        .setRequired(true))
        .addBooleanOption((option) => option
        .setName("isnat20")
        .setDescription("Rolled a Nat 20?")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionId = interaction.channel.id;
            const name = interaction.options.getString("charactername");
            let initiativeRoll = interaction.options.getInteger("initiativeroll");
            const initiativeModifier = interaction.options.getInteger("initiativemodifier");
            const isNpc = interaction.options.getBoolean("isnpc");
            const isNat20 = interaction.options.getBoolean("isnat20");
            if (isNat20) {
                initiativeRoll += 100;
            }
            try {
                const options = {
                    id: uuidv4(),
                    characterName: name,
                    initiative: initiativeRoll + initiativeModifier,
                    initiativeModifier: initiativeModifier,
                    roundOrder: 0,
                    isCurrent: false,
                    statusEffects: [],
                    isNpc: isNpc,
                };
                weapon_of_logging.debug({
                    message: "Grabbing initial values for character",
                    function: "addchar",
                });
                const errorMsg = yield (0, database_common_1.addSingle)(options, sessionId, ServerCommunicationTypes_1.topLevelCollections.SESSIONS, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
                if (errorMsg instanceof Error) {
                    weapon_of_logging.alert(errorMsg.name, errorMsg.message, errorMsg.stack, options);
                    throw new Error(errorMsg.message);
                }
                else {
                    weapon_of_logging.debug({
                        message: "Grabbing initial values for character",
                        function: "addchar",
                    });
                }
                const replyString = `Your character, ${name}, has been added with an initiative of ${initiativeRoll} + ${initiativeModifier} = ${initiativeRoll + initiativeModifier}. You can edit this on the website component using the /link command. \n Any rolled nat 20's have 100 added on for sorting purposes.`;
                weapon_of_logging.info({
                    message: `Replying to interaction: ${replyString}`,
                    function: "addchar",
                });
                index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_2.EmitTypes.CREATE_NEW_INITIATIVE, options);
                yield interaction.reply(replyString);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: "addchar",
                    });
                }
            }
        });
    },
};