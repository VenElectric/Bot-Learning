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
const { finalizeInitiative } = require("../services/initiative");
const { db } = require("../services/firebase-setup");
const create_embed_1 = require("../services/create-embed");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const database_common_1 = require("../services/database-common");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const index_1 = require("../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("resort")
        .setDescription("Resort initiative and keep turn order."),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let newList;
            try {
                let snapshot = yield db
                    .collection("sessions")
                    .doc(interaction.channel.id)
                    .get();
                let isSorted = snapshot.data().isSorted;
                let initiativeList = yield (0, database_common_1.retrieveCollection)(interaction.channel.id, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
                weapon_of_logging.info({ message: "successfully retrieved session data", function: "resort" });
                if (snapshot.data().isSorted) {
                    newList = yield finalizeInitiative(initiativeList, false, interaction.channel.id, 2, true);
                    weapon_of_logging.debug({ message: "isSorted is true", function: "resort" });
                }
                if (!snapshot.data().isSorted) {
                    weapon_of_logging.debug({ message: "isSorted is false", function: "resort" });
                    yield interaction.reply("Initiative has not been sorted yet. Please use the /start command.");
                }
                if (snapshot.data().isSorted === undefined) {
                    for (let item in initiativeList) {
                        initiativeList[item].isCurrent = false;
                    }
                    isSorted = true;
                    newList = yield finalizeInitiative(initiativeList, true, interaction.channel.id, 2, false);
                    weapon_of_logging.debug({ message: "isSorted is undefined", function: "resort" });
                }
                let embed = (0, create_embed_1.initiativeEmbed)(newList);
                weapon_of_logging.info({ message: "resort complete", function: "resort" });
                index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                    payload: newList,
                    isSorted: isSorted,
                });
                yield interaction.reply({
                    content: "Initiative has been resorted.",
                    embeds: [embed],
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                    weapon_of_logging.alert({ message: error.message, function: "resort" });
                }
            }
        });
    },
};
