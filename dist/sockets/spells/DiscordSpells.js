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
const util_1 = require("../util");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.DISCORD_SPELLS,
    execute(io, socket, client, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { retrieveCollection, } = require("../../services/database-common");
            const { spellEmbed } = require("../../services/create-embed");
            let newList = (yield retrieveCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS));
            weapon_of_logging.info({
                message: `retrieving spells for discord embed`,
                function: ServerCommunicationTypes_1.EmitTypes.DISCORD_SPELLS,
            });
            weapon_of_logging.debug({
                message: newList,
                function: ServerCommunicationTypes_1.EmitTypes.DISCORD_SPELLS,
            });
            let spellsEmbed = spellEmbed(newList);
            (0, util_1.channelSend)(client, { embeds: [spellsEmbed] }, sessionId);
        });
    },
};
