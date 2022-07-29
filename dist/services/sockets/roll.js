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
const parse_1 = require("../parse");
const db = __importStar(require("../database-common"));
const util_1 = require("./util");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
function rollSocket(socket, client, io) {
    socket.on(ServerCommunicationTypes_1.EmitTypes.GET_INITIAL_ROLLS, async function (sessionId, respond) {
        weapon_of_logging.debug({
            message: "retrieving initial roll data",
            function: ServerCommunicationTypes_1.EmitTypes.GET_INITIAL_ROLLS,
        });
        const rolls = await db.retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.ROLLS);
        respond(rolls);
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_ROLL, async function (data) {
        weapon_of_logging.debug({
            message: `adding roll ${data.rollData.id}`,
            function: ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_ROLL,
        });
        await db.addSingle(data.rollData, data.sessionId, ServerCommunicationTypes_1.topLevelCollections.SESSIONS, ServerCommunicationTypes_1.secondLevelCollections.ROLLS);
        socket.broadcast
            .to(data.sessionId)
            .emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_ROLL, data.rollData);
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ROLL_RECORD, async function (data) {
        weapon_of_logging.debug({
            message: "updating roll",
            function: ServerCommunicationTypes_1.EmitTypes.UPDATE_ROLL_RECORD,
        });
        await db.updatecollectionRecord(data.rollData, ServerCommunicationTypes_1.secondLevelCollections.ROLLS, data.rollData.id, data.sessionId);
        socket.broadcast
            .to(data.sessionId)
            .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ROLL_RECORD, data.rollData);
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_ROLL, async function (data) {
        await db.deleteSingle(data.docId, data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.ROLLS);
        socket.broadcast
            .to(data.sessionId)
            .emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_ROLL, data.docId);
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DISCORD_ROLL, function (data) {
        const finalRoll = (0, parse_1.addBash)(data.payload.output, "green");
        const finalComment = (0, parse_1.addBash)(data.comment, "blue");
        (0, util_1.channelSend)(client, { content: `Roll Results: ${finalRoll} ${finalComment}` }, data.sessionId);
    });
}
exports.default = rollSocket;
