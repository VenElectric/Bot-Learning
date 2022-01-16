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
const { finalizeInitiative, retrieveSession, } = require("../services/initiative");
const { db } = require("../services/firebase-setup");
const { createEmbed } = require("../services/create-embed");
const LoggingClass_1 = require("../utilities/LoggingClass");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("resort")
        .setDescription("Resort initiative and keep turn order."),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let newList;
            let sessionId = interaction.channel.id;
            try {
                let snapshot = yield db
                    .collection("sessions")
                    .doc(interaction.channel.id)
                    .get();
                let initiativeList = yield retrieveSession(interaction.channel.id);
                LoggingClass_1.weapon_of_logging.INFO("resort", "retrieved initiativeList", initiativeList);
                if (snapshot.data().isSorted) {
                    newList = yield finalizeInitiative(initiativeList, false, interaction.channel.id, 2, true);
                    LoggingClass_1.weapon_of_logging.DEBUG("resort", "isSorted is true", snapshot.data().isSorted);
                }
                if (!snapshot.data().isSorted) {
                    LoggingClass_1.weapon_of_logging.DEBUG("resort", "isSorted is false", snapshot.data().isSorted);
                    yield interaction.reply("Initiative has not been sorted yet. Please use the /start command.");
                }
                if (snapshot.data().isSorted === undefined) {
                    for (let item in initiativeList) {
                        initiativeList[item].isCurrent = false;
                    }
                    newList = yield finalizeInitiative(initiativeList, true, interaction.channel.id, 2, false);
                    LoggingClass_1.weapon_of_logging.DEBUG("resort", "isSorted is undefined", snapshot.data().isSorted);
                }
                let initiativeEmbed = createEmbed(newList);
                LoggingClass_1.weapon_of_logging.INFO("resort", "resort complete", newList);
                yield interaction.reply({
                    content: "Initiative has been resorted.",
                    embeds: [initiativeEmbed],
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    LoggingClass_1.weapon_of_logging.CRITICAL(error.name, error.message, error.stack, newList);
                }
            }
        });
    },
};
