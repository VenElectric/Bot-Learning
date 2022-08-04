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
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.PREVIOUS,
    execute(io, socket, client, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channelSend } = require("../util");
            const { turnOrder } = require("../../services/initiative");
            const { retrieveRecord } = require("../../services/database-common");
            const { statusEmbed } = require("../../services/create-embed");
            const [errorMsg, currentName, currentStatuses, currentId] = yield turnOrder(sessionId, ServerCommunicationTypes_1.EmitTypes.PREVIOUS);
            if (errorMsg instanceof Error) {
                weapon_of_logging.alert({
                    message: errorMsg.message,
                    function: ServerCommunicationTypes_1.EmitTypes.PREVIOUS,
                });
            }
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let record = yield retrieveRecord(currentId, sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
                weapon_of_logging.info({
                    message: record,
                    function: ServerCommunicationTypes_1.EmitTypes.PREVIOUS,
                });
                io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.PREVIOUS, record);
                const statuses = statusEmbed(currentName, currentStatuses);
                channelSend(client, { embeds: [statuses] }, sessionId);
            }), 300);
        });
    },
};
