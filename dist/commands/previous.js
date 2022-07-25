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
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { SlashCommandBuilder } = require("@discordjs/builders");
const { turnOrder, initiativeFunctionTypes, } = require("../services/initiative");
const database_common_1 = require("../services/database-common");
const index_1 = require("../index");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const create_embed_1 = require("../services/create-embed");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("previous")
        .setDescription("Move Turn Order Backwards"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let [errorMsg, currentTurn, currentStatuses, currentId] = yield turnOrder(interaction.channel.id, initiativeFunctionTypes.PREVIOUS);
            const statuses = (0, create_embed_1.statusEmbed)(currentTurn, currentStatuses);
            if (errorMsg instanceof Error) {
                weapon_of_logging.alert({ message: errorMsg.message, function: "next" });
            }
            weapon_of_logging.info({
                message: "previous turn success",
                function: "next",
            });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let record = yield (0, database_common_1.retrieveRecord)(currentId, interaction.channel.id, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
                index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.NEXT, record);
            }), 300);
            yield interaction.reply({ embeds: [statuses] });
        });
    },
};
