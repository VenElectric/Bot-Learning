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
const { db } = require("../services/firebase-setup");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const database_common_1 = require("../services/database-common");
const index_1 = require("../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearsessionlist")
        .setDescription("Clear all initiative and spells for this session."),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sessionId = interaction.channel.id;
                yield (0, database_common_1.deleteSession)(sessionId);
                weapon_of_logging.debug({
                    message: "reset of spells and initiative",
                    function: "clearsessionlist",
                });
                index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE);
                index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_SPELL);
                yield interaction.reply("Reset Complete");
            }
            catch (error) {
                console.log("error", error);
            }
        });
    },
};
