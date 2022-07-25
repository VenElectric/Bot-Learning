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
const db = __importStar(require("../database-common"));
const create_embed_1 = require("../create-embed");
const util_1 = require("./util");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
function spellSocket(socket, client, io) {
    socket.on(ServerCommunicationTypes_1.EmitTypes.GET_SPELLS, function (sessionId, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let spells;
            weapon_of_logging.debug({
                message: "retrieving initial spell data",
                function: ServerCommunicationTypes_1.EmitTypes.GET_SPELLS,
            });
            spells = yield db.retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.SPELLS);
            if (spells instanceof Error) {
                weapon_of_logging.alert({
                    message: spells.message,
                    function: ServerCommunicationTypes_1.EmitTypes.GET_SPELLS,
                });
            }
            weapon_of_logging.debug({
                message: "succesfully retrieved spells",
                function: ServerCommunicationTypes_1.EmitTypes.GET_SPELLS,
            });
            respond(spells);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_SPELL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage;
            const spellRecord = Object.assign({}, data.payload);
            finalMessage = yield db.addSingle(spellRecord, data.sessionId, ServerCommunicationTypes_1.topLevelCollections.SESSIONS, ServerCommunicationTypes_1.secondLevelCollections.SPELLS);
            weapon_of_logging.info({
                message: `Spell successfully added`,
                function: "Create new socket receiver",
                docId: data.payload.id,
            });
            socket.broadcast
                .to(data.sessionId)
                .emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_SPELL, data.payload);
            if (finalMessage instanceof Error) {
                weapon_of_logging.alert({
                    message: finalMessage.message,
                    function: ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_SPELL,
                    docId: data.payload.id,
                });
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_SPELL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.docId !== undefined) {
                let finalMessage = yield db.deleteSingle(data.docId, data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.SPELLS);
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
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_SPELL, function (sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db.deleteCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.SPELLS);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_SPELL,
                    });
                }
            }
            socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_SPELL);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_SPELL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({
                message: "updating one value",
                function: "UPDATE ONE SOCKET RECEIVER",
            });
            if (data.docId) {
                try {
                    db.updateCollectionItem(data.toUpdate, ServerCommunicationTypes_1.secondLevelCollections.SPELLS, data.docId, data.sessionId, data.ObjectType);
                    socket.broadcast
                        .to(data.sessionId)
                        .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_SPELL, {
                        payload: {
                            toUpdate: data.toUpdate,
                            ObjectType: data.ObjectType,
                            docId: data.docId,
                        },
                        collectionType: data.collectionType,
                    });
                }
                catch (error) {
                    if (error instanceof Error) {
                        weapon_of_logging.alert({
                            message: error.message,
                            function: ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_SPELL,
                        });
                    }
                }
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_SPELL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({
                message: "updating one value",
                function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_SPELL,
                docId: data.payload.id,
            });
            try {
                const spellRecord = Object.assign({}, data.payload);
                console.log(spellRecord);
                yield db.updatecollectionRecord(spellRecord, ServerCommunicationTypes_1.secondLevelCollections.SPELLS, data.payload.id, data.sessionId);
                weapon_of_logging.debug({
                    message: ServerCommunicationTypes_1.secondLevelCollections.SPELLS,
                    function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_SPELL,
                    docId: data.payload.id,
                });
                console.log(data.sessionId);
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_SPELL, data.payload);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_SPELL,
                        docId: data.payload.id,
                    });
                }
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_SPELL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let spellRecord = [...data.payload];
                yield db.updateCollection(data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.SPELLS, spellRecord);
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_SPELL, data.payload);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_SPELL,
                    });
                }
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DISCORD_SPELL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newList = (yield db.retrieveCollection(data.sessionId, data.collectionType));
                weapon_of_logging.info({
                    message: `retrieving ${data.collectionType} for discord embed`,
                    function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                });
                weapon_of_logging.debug({
                    message: newList,
                    function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                });
                let spellsEmbed = (0, create_embed_1.spellEmbed)(newList);
                (0, util_1.channelSend)(client, { embeds: [spellsEmbed] }, data.sessionId);
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
    });
}
exports.default = spellSocket;
