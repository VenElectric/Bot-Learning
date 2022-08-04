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
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
const util_1 = require("../util");
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.DISCORD_INITIATIVE,
    execute(io, socket, client, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { retrieveCollection, getSession } = require("../../services/database-common");
            const { resortInitiative, finalizeInitiative } = require("../../services/initiative");
            const { initiativeEmbed } = require("../../services/create-embed");
            let sortedList;
            // emit to sonic
            try {
                let newList = (yield retrieveCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE));
                weapon_of_logging.info({
                    message: `retrieving initiative for discord embed`,
                    function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                });
                let [isSorted, onDeck, sessionSize] = yield getSession(sessionId);
                if (isSorted) {
                    sortedList = resortInitiative(newList);
                }
                else {
                    sortedList = yield finalizeInitiative(newList, false, sessionId);
                }
                let initEmbed = initiativeEmbed(sortedList);
                (0, util_1.channelSend)(client, { embeds: [initEmbed] }, sessionId);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                    });
                }
            }
        });
    },
};
