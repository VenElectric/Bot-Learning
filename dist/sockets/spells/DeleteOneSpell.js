"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_SPELL,
    async execute(io, socket, client, data) {
        const { deleteSingle } = await Promise.resolve().then(() => __importStar(require("../../services/database-common")));
        if (data.docId !== undefined) {
            let finalMessage = await deleteSingle(data.docId, data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.SPELLS);
            if (finalMessage instanceof Error) {
                weapon_of_logging.alert({
                    message: finalMessage.message,
                    function: ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_SPELL,
                    docId: data.docId,
                });
            }
            socket.broadcast
                .to(data.sessionId)
                .emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_SPELL, data.docId);
        }
    }
};
