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
exports.socketReceiver = void 0;
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const GameSessionTypes_1 = require("../Interfaces/GameSessionTypes");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const TypeChecking_1 = require("../utilities/TypeChecking");
const LoggingTypes_1 = require("../Interfaces/LoggingTypes");
const dbCall = __importStar(require("./database-common"));
const initiative_1 = require("../services/initiative");
const initiativeFunctions = __importStar(require("../services/initiative"));
const create_embed_1 = require("./create-embed");
function channelSend(client, item, sessionId) {
    client.channels.fetch(sessionId).then((channel) => {
        channel.send(item);
        weapon_of_logging.info({
            message: "sending initiative to discord channel success",
            function: "DISCORD SOCKET_RECEIVER",
        });
    });
}
function socketReceiver(socket, client, io) {
    socket.on(LoggingTypes_1.LoggingTypes.debug, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({ message: data.message, function: data.function });
        });
    });
    // LOGGING SOCKETS
    socket.on(LoggingTypes_1.LoggingTypes.info, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.info({ message: data.message, function: data.function });
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.alert, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.alert({ message: data.message, function: data.function });
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.warning, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.warning({
                message: data.message,
                function: data.function,
            });
        });
    });
    // DATABASE/INITIATIVE/SPELL SOCKETS
    socket.on(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage;
            weapon_of_logging.debug({
                message: data.payload,
                function: "Create new socket receiver",
            });
            if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.INITIATIVE) {
                finalMessage = yield dbCall.addSingle(data.payload, data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
                dbCall.updateSession(data.sessionId, undefined, false);
                // where should this broadcast to?
                socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW, {
                    payload: data.payload,
                    collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                });
            }
            if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.SPELLS) {
                finalMessage = yield dbCall.addSingle(data.payload, data.sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS);
                weapon_of_logging.debug({
                    message: data.payload,
                    function: "Create new socket receiver",
                });
                socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW, {
                    payload: data.payload,
                    collectionType: ServerCommunicationTypes_1.collectionTypes.SPELLS,
                });
            }
            else {
                finalMessage = `Invalid Collection Type. Type Sent: ${data.collectionType}`;
            }
            if (finalMessage instanceof Error) {
                weapon_of_logging.alert({
                    message: finalMessage.message,
                    function: "create_new SocketReceiver",
                });
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.docId !== undefined) {
                let finalMessage = yield dbCall.deleteSingle(data.docId, data.sessionId, data.collectionType);
                if (finalMessage instanceof Error) {
                    weapon_of_logging.alert({
                        message: finalMessage.message,
                        function: "DELETE_ONE SocketReceiver",
                    });
                }
                if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.INITIATIVE) {
                    let [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
                    sessionSize -= 1;
                    isSorted = false;
                    onDeck = 0;
                    let errorMsg = yield dbCall.updateSession(data.sessionId, onDeck, isSorted, sessionSize);
                    socket.broadcast
                        .to(data.sessionId)
                        .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_SESSION, false);
                    if (errorMsg instanceof Error) {
                        weapon_of_logging.alert({
                            message: errorMsg.message,
                            function: "DELETE_ONE SocketReceiver",
                        });
                    }
                }
                socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE, {
                    id: data.docId,
                    collectionType: data.collectionType,
                });
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL, function (sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dbCall.deleteSession(sessionId);
            let errorMsg = yield dbCall.updateSession(sessionId, 0, false, 0);
            if (errorMsg instanceof Error) {
                weapon_of_logging.alert({
                    message: errorMsg.message,
                    function: "DELETE_ONE SocketReceiver",
                });
            }
            socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_SESSION, false);
            socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.GET_INITIAL, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let sessionId = data.sessionId;
            let initiative;
            let isSorted;
            let onDeck;
            let sessionSize;
            weapon_of_logging.debug({
                message: "retrieving initial data",
                function: "GET_INITIAL SOCKET RECEIVER",
            });
            if (data.sessionId !== undefined) {
                initiative = (yield dbCall.retrieveCollection(data.sessionId, data.collectionType));
                [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
            }
            if (isSorted) {
                if (initiative !== undefined) {
                    initiative = initiativeFunctions.resortInitiative(initiative);
                }
            }
            if (initiative instanceof Error) {
                weapon_of_logging.alert({
                    message: initiative.message,
                    function: "GET_INITIAL SOCKET RECEIVER",
                });
            }
            weapon_of_logging.debug({
                message: "succesfully retrieved initiative",
                function: "GET_INITIAL SOCKET RECEIVER",
            });
            respond({ initiativeList: initiative, isSorted: isSorted });
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.GET_SPELLS, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let spells;
            weapon_of_logging.debug({
                message: "retrieving initial spell data",
                function: "GET_SPELLS SOCKET RECEIVER",
            });
            if (data.sessionId !== undefined) {
                spells = yield dbCall.retrieveCollection(data.sessionId, data.collectionType);
            }
            if (spells instanceof Error) {
                weapon_of_logging.alert({
                    message: spells.message,
                    function: "GET_INITIAL SOCKET RECEIVER",
                });
            }
            weapon_of_logging.debug({
                message: "succesfully retrieved spells",
                function: "GET_SPELLS SOCKET RECEIVER",
            });
            respond({ spells: spells });
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.NEXT, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [errorMsg, currentName, currentStatuses, currentId] = yield (0, initiative_1.turnOrder)(data.sessionId, initiativeFunctions.initiativeFunctionTypes.NEXT);
            console.log(currentStatuses);
            if (errorMsg instanceof Error) {
                weapon_of_logging.alert(errorMsg.name, errorMsg.message, errorMsg.stack, data.payload);
            }
            weapon_of_logging.info({
                message: "succesfully retrieved next",
                function: "NEXT SOCKET RECEIVER",
            });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let record = yield dbCall.retrieveRecord(currentId, data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
                weapon_of_logging.info({
                    message: record,
                    function: "next SOCKET RECEIER",
                });
                io.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.NEXT, record);
                const statuses = (0, create_embed_1.statusEmbed)(currentName, currentStatuses);
                channelSend(client, { embeds: [statuses] }, data.sessionId);
            }), 300);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.PREVIOUS, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [errorMsg, currentName, currentStatuses, currentId] = yield (0, initiative_1.turnOrder)(data.sessionId, initiativeFunctions.initiativeFunctionTypes.PREVIOUS);
            if (errorMsg instanceof Error) {
                weapon_of_logging.alert({
                    message: errorMsg.message,
                    function: "PREVIOUS SOCKET RECEIVER",
                });
            }
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let record = yield dbCall.retrieveRecord(currentId, data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
                weapon_of_logging.info({
                    message: record,
                    function: "previous SOCKET RECEIER",
                });
                io.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.PREVIOUS, record);
                const statuses = (0, create_embed_1.statusEmbed)(currentName, currentStatuses);
                channelSend(client, { embeds: [statuses] }, data.sessionId);
            }), 300);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.RESORT, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let initiativeList = (yield dbCall.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE));
            if ((0, TypeChecking_1.isInitiativeObjectArray)(initiativeList)) {
                let finalMessage = initiativeFunctions.resortInitiative(initiativeList);
                socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, {
                    payload: finalMessage,
                    collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                });
                if (finalMessage instanceof Error) {
                    weapon_of_logging.alert({
                        message: finalMessage.message,
                        function: "RESORT SOCKET RECEIVER",
                    });
                }
                respond(finalMessage);
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.RE_ROLL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.docId) {
                let initiativeList = data.payload;
                let docId = data.docId;
                let finalMessage = yield dbCall.updatecollectionRecord(initiativeList, data.collectionType, docId, data.sessionId);
                socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM, {
                    payload: {
                        toUpdate: initiativeList.initiative,
                        ObjectType: GameSessionTypes_1.InitiativeObjectEnums.initiative,
                        docId: data.docId,
                    },
                    collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                });
                if (finalMessage instanceof Error) {
                    weapon_of_logging.alert({
                        message: finalMessage.message,
                        function: "REROLL SOCKET RECEIVER",
                    });
                }
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({
                message: "updating one value",
                function: "UPDATE ONE SOCKET RECEIVER",
            });
            if (data.docId) {
                try {
                    dbCall.updateCollectionItem(data.toUpdate, data.collectionType.toLowerCase(), data.docId, data.sessionId, data.ObjectType);
                    socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM, {
                        payload: {
                            toUpdate: data.toUpdate,
                            ObjectType: data.ObjectType,
                            docId: data.docId,
                        },
                        collectionType: data.collectionType,
                    });
                    // probably do not need this
                }
                catch (error) {
                    if (error instanceof Error) {
                        weapon_of_logging.alert({
                            message: error.message,
                            function: "UPDATE_ONE SOCKET RECEIVER",
                        });
                    }
                }
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({
                message: "updating one value",
                function: "UPDATE RECORD SOCKET RECEIVER",
            });
            try {
                if (data.docId == undefined) {
                    weapon_of_logging.warning({
                        message: "missing docid",
                        function: "UPDATE RECORD SOCKET RECEIVER",
                    });
                    return;
                }
                yield dbCall.updatecollectionRecord(data.payload, data.collectionType, data.docId, data.sessionId);
                weapon_of_logging.debug({
                    message: data.collectionType,
                    function: "update record",
                });
                socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD, {
                    payload: data.payload,
                    collectionType: data.collectionType,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: "UPDATE RECORD SOCKET RECEIVER",
                    });
                }
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            let isSorted;
            if (data.isSorted !== undefined) {
                isSorted = data.isSorted;
                weapon_of_logging.debug({
                    message: `isSorted is: ${isSorted}`,
                    function: "UPDATE_ALL SOCKET RECEIVER",
                });
            }
            if ((0, TypeChecking_1.isInitiativeObjectArray)(data.payload) ||
                (0, TypeChecking_1.isSpellObjectArray)(data.payload)) {
                for (let record of data.payload) {
                    try {
                        let finalMessage = yield dbCall.updatecollectionRecord(record, data.collectionType, record.id, data.sessionId);
                        if (finalMessage instanceof Error) {
                            weapon_of_logging.alert({
                                message: finalMessage.message,
                                function: "UPDATE_ALL SOCKET RECEIVER",
                            });
                        }
                        else {
                            weapon_of_logging.info({
                                message: "Collection was updated successfully",
                                function: "UPDATE_ALL SOCKET RECEIVER",
                            });
                        }
                    }
                    catch (error) {
                        if (error instanceof Error) {
                            weapon_of_logging.alert({
                                message: error.message,
                                function: "UPDATE_ALL SOCKET RECEIVER",
                            });
                            continue;
                        }
                    }
                }
            }
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.INITIATIVE) {
                    let initiativeList = (yield dbCall.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE));
                    if (data.isSorted !== undefined) {
                        if (data.isSorted) {
                            weapon_of_logging.debug({
                                message: `data.isSorted is: ${data.isSorted}`,
                                function: "UPDATE_ALL SOCKET RECEIVER",
                            });
                            initiativeList = (0, initiative_1.resortInitiative)(initiativeList);
                        }
                    }
                    if (data.resetOnDeck) {
                        weapon_of_logging.debug({
                            message: `resortOndeck: ${data.resetOnDeck}`,
                            function: "UPDATE_ALL SOCKET RECEIVER",
                        });
                        const trueIndex = initiativeList
                            .map((item) => item.isCurrent)
                            .indexOf(true);
                        let OnDeck = initiativeList[trueIndex].roundOrder + 1;
                        const errorMsg = dbCall.updateSession(data.sessionId, OnDeck, undefined, initiativeList.length);
                        socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, {
                            payload: initiativeList,
                            collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                            isSorted: true,
                        });
                        if (errorMsg instanceof Error) {
                            weapon_of_logging.alert({
                                message: errorMsg.message,
                                function: "UPDATE_ALL SOCKET RECEIVER",
                            });
                        }
                    }
                    else {
                        socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, {
                            payload: initiativeList,
                            collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                            isSorted: data.isSorted,
                        });
                    }
                    weapon_of_logging.debug({
                        message: "update to initiative successful",
                        function: "UPDATE all socket receiver",
                    });
                    weapon_of_logging.debug({
                        message: `isSorted is: ${data.isSorted}`,
                        function: "UPDATE_ALL SOCKET RECEIVER",
                    });
                    return;
                }
                if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.SPELLS) {
                    const spells = yield dbCall.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS);
                    socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, {
                        payload: spells,
                        collectionType: ServerCommunicationTypes_1.collectionTypes.SPELLS,
                    });
                }
            }), 200);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.ROUND_START, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let initiativeList = yield dbCall.retrieveCollection(data.sessionId, data.collectionType);
                weapon_of_logging.debug({
                    message: "starting round start, initiative retrieved",
                    function: "ROUND_START SOCKET_RECEIVER",
                });
                if ((0, TypeChecking_1.isInitiativeObjectArray)(initiativeList)) {
                    let finalMessage = yield initiativeFunctions.finalizeInitiative(initiativeList, true, data.sessionId);
                    const startEmbed = (0, create_embed_1.initiativeEmbed)(finalMessage);
                    channelSend(client, { embeds: [startEmbed], content: "Rounds have started" }, data.sessionId);
                    weapon_of_logging.info({
                        message: "initiative sorted and being emitted",
                        function: "ROUND_START SOCKET_RECEIVER",
                    });
                    socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, {
                        payload: finalMessage,
                        collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                        isSorted: true,
                    });
                    respond(finalMessage);
                }
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    weapon_of_logging.warning({
                        message: error.message,
                        function: "ROUND_START SOCKET_RECEIVER",
                    });
                    respond("No initiative to sort. Please add in initiative");
                }
                else if (error instanceof Error &&
                    !(error instanceof ReferenceError)) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: "ROUND_START SOCKET_RECEIVER",
                    });
                }
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DISCORD, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortedList;
            try {
                if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.INITIATIVE) {
                    let newList = (yield dbCall.retrieveCollection(data.sessionId, data.collectionType));
                    weapon_of_logging.info({
                        message: `retrieving ${data.collectionType} for discord embed`,
                        function: "DISCORD SOCKET_RECEIVER",
                    });
                    let [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
                    sortedList = yield initiativeFunctions.finalizeInitiative(newList, false, data.sessionId);
                    let initEmbed = (0, create_embed_1.initiativeEmbed)(sortedList);
                    channelSend(client, { embeds: [initEmbed] }, data.sessionId);
                }
                if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.SPELLS) {
                    let newList = (yield dbCall.retrieveCollection(data.sessionId, data.collectionType));
                    weapon_of_logging.info({
                        message: `retrieving ${data.collectionType} for discord embed`,
                        function: "DISCORD SOCKET_RECEIVER",
                    });
                    weapon_of_logging.debug({
                        message: newList,
                        function: "DISCORD SOCKET_RECEIVER",
                    });
                    let spellsEmbed = (0, create_embed_1.spellEmbed)(newList);
                    channelSend(client, { embeds: [spellsEmbed] }, data.sessionId);
                }
                else {
                    weapon_of_logging.debug({
                        message: "Enum not recognized",
                        function: "DISCORD SOCKET_RECEIVER",
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: "DISCORD SOCKET_RECEIVER",
                    });
                }
            }
        });
    });
}
exports.socketReceiver = socketReceiver;
