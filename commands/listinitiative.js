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
// get session embed (initiative list in table format)
const { SlashCommandBuilder } = require("@discordjs/builders");
const initiative_1 = require("../services/initiative");
const database_common_1 = require("../services/database-common");
const LoggingClass_1 = require("../utilities/LoggingClass");
const create_embed_1 = require("../services/create-embed");
// import { webComponent, devWeb } from "../services/constants"
// const { hyperlink } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("listinitiative")
        .setDescription("Create an embed that shows initiative"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let sessionId = interaction.channel.id;
            try {
                let newList = (yield (0, database_common_1.retrieveCollection)(sessionId, "initiative"));
                LoggingClass_1.weapon_of_logging.INFO("listinitiative", "getting initiative list", newList);
                let [isSorted, onDeck, sessionSize] = yield (0, database_common_1.getSession)(sessionId);
                let sortedList = yield (0, initiative_1.finalizeInitiative)(newList, isSorted, sessionId, onDeck, isSorted);
                let initEmbed = (0, create_embed_1.initiativeEmbed)(sortedList);
                LoggingClass_1.weapon_of_logging.DEBUG("listinitiative", "sorted Initiative and created embed", sortedList);
                yield interaction.reply({ embeds: [initEmbed] });
            }
            catch (error) {
                if (error instanceof Error) {
                    LoggingClass_1.weapon_of_logging.CRITICAL("listinitiative", "uncaught error", error.stack, error.message);
                }
            }
        });
    },
};
