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
const { initiativeEmbed } = require("../services/create-embed");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const index_1 = require("../index");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Start Initiative and reset turn order."),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let initiativeSnap = yield db
                    .collection("sessions")
                    .doc(interaction.channel.id)
                    .collection("initiative")
                    .get();
                let initiativeList = [];
                weapon_of_logging.debug({
                    message: "retrieved initiative data from database",
                    function: "start",
                });
                initiativeSnap.forEach((doc) => {
                    let record = doc.data();
                    record.isCurrent = false;
                    initiativeList.push(record);
                    weapon_of_logging.debug({
                        message: "reset isCurrent",
                        function: "start",
                    });
                });
                const newList = yield finalizeInitiative(initiativeList, true, interaction.channel.id, 2, true);
                console.log(newList);
                weapon_of_logging.info({
                    message: "finalize initiative complete",
                    function: "start",
                });
                let embed = initiativeEmbed(newList);
                weapon_of_logging.debug({ message: "embed created", function: "start" });
                setTimeout(() => {
                    index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                        payload: newList,
                        collectionType: ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE,
                        isSorted: true,
                    });
                    index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.ROUND_START);
                }, 300);
                yield interaction.reply({
                    content: "Rounds have been started.",
                    embeds: [embed],
                });
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    weapon_of_logging.alert({ message: error.message, function: "start" });
                }
            }
        });
    },
};