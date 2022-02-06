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
    socket.on(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE, function (data) {
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
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE, data.payload);
            }
            else {
                finalMessage = `Invalid Collection Type. Type Sent: ${data.collectionType}`;
            }
            if (finalMessage instanceof Error) {
                weapon_of_logging.alert({
                    message: finalMessage.message,
                    function: ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_SPELL,
                    docId: data.payload.id,
                });
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_SPELL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage;
            if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.SPELLS) {
                finalMessage = yield dbCall.addSingle(data.payload, data.sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS);
                weapon_of_logging.info({
                    message: `Spell successfully added`,
                    function: "Create new socket receiver",
                    docId: data.payload.id,
                });
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_SPELL, data.payload);
            }
            else {
                finalMessage = `Invalid Collection Type. Type Sent: ${data.collectionType}`;
            }
            if (finalMessage instanceof Error) {
                weapon_of_logging.alert({
                    message: finalMessage.message,
                    function: ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_SPELL,
                    docId: data.payload.id,
                });
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_INITIATIVE, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.docId !== undefined) {
                let finalMessage = yield dbCall.deleteSingle(data.docId, data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
                if (finalMessage instanceof Error) {
                    weapon_of_logging.alert({
                        message: finalMessage.message,
                        function: ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_INITIATIVE,
                        docId: data.docId,
                    });
                }
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
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_INITIATIVE, data.docId);
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_SPELL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.docId !== undefined) {
                let finalMessage = yield dbCall.deleteSingle(data.docId, data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE, function (sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield dbCall.deleteCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE,
                    });
                }
            }
            socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_SESSION, false);
            socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_SPELL, function (sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield dbCall.deleteCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.GET_INITIAL, function (sessionId, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let initiative;
            let isSorted;
            let onDeck;
            let sessionSize;
            weapon_of_logging.debug({
                message: "retrieving initial data",
                function: ServerCommunicationTypes_1.EmitTypes.GET_INITIAL,
            });
            initiative = (yield dbCall.retrieveCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE));
            [isSorted, onDeck, sessionSize] = yield dbCall.getSession(sessionId);
            if (isSorted) {
                if (initiative !== undefined) {
                    initiative = initiativeFunctions.resortInitiative(initiative);
                }
            }
            if (initiative instanceof Error) {
                weapon_of_logging.alert({
                    message: initiative.message,
                    function: ServerCommunicationTypes_1.EmitTypes.GET_INITIAL,
                });
            }
            weapon_of_logging.debug({
                message: "succesfully retrieved initiative",
                function: ServerCommunicationTypes_1.EmitTypes.GET_INITIAL,
            });
            respond({ initiativeList: initiative, isSorted: isSorted });
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.GET_SPELLS, function (sessionId, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let spells;
            weapon_of_logging.debug({
                message: "retrieving initial spell data",
                function: ServerCommunicationTypes_1.EmitTypes.GET_SPELLS,
            });
            spells = yield dbCall.retrieveCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.NEXT, function (sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [errorMsg, currentName, currentStatuses, currentId] = yield (0, initiative_1.turnOrder)(sessionId, initiativeFunctions.initiativeFunctionTypes.NEXT);
            weapon_of_logging.debug({ message: "next turn and statuses retrieved", function: ServerCommunicationTypes_1.EmitTypes.NEXT, docId: currentId });
            if (errorMsg instanceof Error) {
                weapon_of_logging.alert({
                    message: errorMsg.message,
                    function: ServerCommunicationTypes_1.EmitTypes.NEXT,
                });
            }
            weapon_of_logging.info({
                message: "succesfully retrieved next",
                function: ServerCommunicationTypes_1.EmitTypes.NEXT,
            });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let record = yield dbCall.retrieveRecord(currentId, sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
                weapon_of_logging.info({
                    message: record,
                    function: ServerCommunicationTypes_1.EmitTypes.NEXT,
                });
                io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.NEXT, record);
                const statuses = (0, create_embed_1.statusEmbed)(currentName, currentStatuses);
                channelSend(client, { embeds: [statuses] }, sessionId);
            }), 300);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.PREVIOUS, function (sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [errorMsg, currentName, currentStatuses, currentId] = yield (0, initiative_1.turnOrder)(sessionId, initiativeFunctions.initiativeFunctionTypes.PREVIOUS);
            if (errorMsg instanceof Error) {
                weapon_of_logging.alert({
                    message: errorMsg.message,
                    function: ServerCommunicationTypes_1.EmitTypes.PREVIOUS,
                });
            }
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let record = yield dbCall.retrieveRecord(currentId, sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
                weapon_of_logging.info({
                    message: record,
                    function: ServerCommunicationTypes_1.EmitTypes.PREVIOUS,
                });
                io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.PREVIOUS, record);
                const statuses = (0, create_embed_1.statusEmbed)(currentName, currentStatuses);
                channelSend(client, { embeds: [statuses] }, sessionId);
            }), 300);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.RESORT, function (sessionId, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let initiativeList = yield dbCall.retrieveCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
            if ((0, TypeChecking_1.isInitiativeObjectArray)(initiativeList)) {
                try {
                    initiativeList = initiativeFunctions.resortInitiative(initiativeList);
                    weapon_of_logging.info({
                        message: "Resort Complete",
                        function: ServerCommunicationTypes_1.EmitTypes.RESORT,
                    });
                    socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                        payload: initiativeList,
                        collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                    });
                    respond(initiativeList);
                }
                catch (error) {
                    if (error instanceof Error) {
                        weapon_of_logging.alert({
                            message: error.message,
                            function: ServerCommunicationTypes_1.EmitTypes.RESORT,
                        });
                    }
                }
            }
        });
    });
    // socket.on(EmitTypes.RE_ROLL, async function (data: InitiativeSocketDataObject) {
    //   if (data.docId) {
    //     let initiativeList = data.payload as InitiativeObject;
    //     let docId = data.docId;
    //     let finalMessage = await dbCall.updatecollectionRecord(
    //       initiativeList,
    //       data.collectionType,
    //       docId,
    //       data.sessionId
    //     );
    //     socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ITEM, {
    //       payload: {
    //         toUpdate: initiativeList.initiative,
    //         ObjectType: InitiativeObjectEnums.initiative,
    //         docId: data.docId,
    //       },
    //       collectionType: collectionTypes.INITIATIVE,
    //     });
    //     if (finalMessage instanceof Error) {
    //       weapon_of_logging.alert({
    //         message: finalMessage.message,
    //         function: "REROLL SOCKET RECEIVER",
    //       });
    //     }
    //   }
    // });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_INITIATIVE, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({
                message: "updating one value",
                function: ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_INITIATIVE,
                docId: data.docId,
            });
            if (data.docId) {
                try {
                    dbCall.updateCollectionItem(data.toUpdate, ServerCommunicationTypes_1.collectionTypes.INITIATIVE, data.docId, data.sessionId, data.ObjectType);
                    socket.broadcast
                        .to(data.sessionId)
                        .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_INITIATIVE, {
                        payload: {
                            toUpdate: data.toUpdate,
                            ObjectType: data.ObjectType,
                            docId: data.docId,
                        },
                        collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                    });
                    // probably do not need this
                }
                catch (error) {
                    if (error instanceof Error) {
                        weapon_of_logging.alert({
                            message: error.message,
                            function: ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_INITIATIVE,
                            docId: data.docId,
                        });
                    }
                }
            }
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
                    dbCall.updateCollectionItem(data.toUpdate, ServerCommunicationTypes_1.collectionTypes.SPELLS, data.docId, data.sessionId, data.ObjectType);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({
                message: "updating one value",
                function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE,
                docId: data.payload.id,
            });
            try {
                yield dbCall.updatecollectionRecord(data.payload, ServerCommunicationTypes_1.collectionTypes.INITIATIVE, data.payload.id, data.sessionId);
                weapon_of_logging.debug({
                    message: "update complete, broadcasting to room",
                    function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE,
                    docId: data.payload.id,
                });
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE, data.payload);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE,
                        docId: data.payload.id,
                    });
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
                yield dbCall.updatecollectionRecord(data.payload, ServerCommunicationTypes_1.collectionTypes.SPELLS, data.payload.id, data.sessionId);
                weapon_of_logging.debug({
                    message: data.collectionType,
                    function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_SPELL,
                    docId: data.payload.id,
                });
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            let isSorted;
            if (data.isSorted !== undefined) {
                isSorted = data.isSorted;
                weapon_of_logging.debug({
                    message: `isSorted is: ${isSorted}`,
                    function: "UPDATE_ALL SOCKET RECEIVER",
                });
            }
            try {
                yield dbCall.updateCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE, data.payload);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    let initiativeList = yield dbCall.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
                    if ((0, TypeChecking_1.isInitiativeObjectArray)(initiativeList)) {
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
                            socket.broadcast
                                .to(data.sessionId)
                                .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
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
                            socket.broadcast
                                .to(data.sessionId)
                                .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                                payload: initiativeList,
                                collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                                isSorted: data.isSorted,
                            });
                        }
                    }
                }), 200);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE,
                    });
                }
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_SPELL, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield dbCall.updateCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE, data.payload);
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                    payload: data.payload,
                    collectionType: ServerCommunicationTypes_1.collectionTypes.SPELLS,
                });
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.ROUND_START, function (sessionId, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let initiativeList = yield dbCall.retrieveCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
                weapon_of_logging.debug({
                    message: "starting round start, initiative retrieved",
                    function: "ROUND_START SOCKET_RECEIVER",
                });
                if ((0, TypeChecking_1.isInitiativeObjectArray)(initiativeList)) {
                    initiativeList = yield initiativeFunctions.finalizeInitiative(initiativeList, true, sessionId);
                    const startEmbed = (0, create_embed_1.initiativeEmbed)(initiativeList);
                    channelSend(client, { embeds: [startEmbed], content: "Rounds have started" }, sessionId);
                    weapon_of_logging.info({
                        message: "initiative sorted and being emitted",
                        function: "ROUND_START SOCKET_RECEIVER",
                    });
                    socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.ROUND_START);
                    socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                        payload: initiativeList,
                        collectionType: ServerCommunicationTypes_1.collectionTypes.INITIATIVE,
                        isSorted: true,
                    });
                    respond(initiativeList);
                }
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    weapon_of_logging.warning({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.ROUND_START,
                    });
                    respond("No initiative to sort. Please add in initiative");
                }
                else if (error instanceof Error &&
                    !(error instanceof ReferenceError)) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.ROUND_START,
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
                        function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                    });
                    let [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
                    if (isSorted) {
                        sortedList = (0, initiative_1.resortInitiative)(newList);
                    }
                    else {
                        sortedList = yield initiativeFunctions.finalizeInitiative(newList, false, data.sessionId);
                    }
                    let initEmbed = (0, create_embed_1.initiativeEmbed)(sortedList);
                    channelSend(client, { embeds: [initEmbed] }, data.sessionId);
                }
                if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.SPELLS) {
                    let newList = (yield dbCall.retrieveCollection(data.sessionId, data.collectionType));
                    weapon_of_logging.info({
                        message: `retrieving ${data.collectionType} for discord embed`,
                        function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                    });
                    weapon_of_logging.debug({
                        message: newList,
                        function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                    });
                    let spellsEmbed = (0, create_embed_1.spellEmbed)(newList);
                    channelSend(client, { embeds: [spellsEmbed] }, data.sessionId);
                }
                else {
                    weapon_of_logging.debug({
                        message: "Enum not recognized",
                        function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                    });
                }
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
exports.socketReceiver = socketReceiver;
