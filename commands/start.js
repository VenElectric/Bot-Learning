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
const { createEmbed } = require("../services/create-embed");
const LoggingClass_1 = require("../utilities/LoggingClass");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Start Initiative and reset turn order."),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let newList;
            let sessionId = interaction.channel.id;
            try {
                let initiativeSnap = yield db
                    .collection("sessions")
                    .doc(interaction.channel.id)
                    .collection("initiative")
                    .get();
                let initiativeList = [];
                initiativeSnap.forEach((doc) => {
                    let record = doc.data();
                    record.isCurrent = false;
                    console.log(record);
                    initiativeList.push(record);
                });
                newList = yield finalizeInitiative(initiativeList, true, interaction.channel.id, 2, true);
                LoggingClass_1.weapon_of_logging.INFO("start", "newList data", newList, sessionId);
                console.log(newList, "newList");
                let initiativeEmbed = createEmbed(newList);
                yield interaction.reply({
                    content: "Rounds have been started.",
                    embeds: [initiativeEmbed],
                });
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    LoggingClass_1.weapon_of_logging.CRITICAL(error.name, error.message, error.stack, newList, sessionId);
                }
            }
        });
    },
};
