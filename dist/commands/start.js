"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("discord.js");
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
    description: `Start rounds and sort initiative. Use this if you are just starting initiative or if you want to restart from the top of the initiative order.`,
    async execute(interaction) {
        try {
            let initiativeSnap = await db
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
            const newList = await finalizeInitiative(initiativeList, true, interaction.channel.id, 2, true);
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
            await interaction.reply({
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
    },
};
