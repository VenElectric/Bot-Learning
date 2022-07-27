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
const db = __importStar(require("../database-common"));
const init = __importStar(require("../initiative"));
const create_embed_1 = require("../create-embed");
const initiative_1 = require("../initiative");
const util_1 = require("./util");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
function initiativeSocket(socket, client, io) {
    socket.on(ServerCommunicationTypes_1.EmitTypes.GET_INITIAL, async function (sessionId, respond) {
        let initiative;
        let isSorted;
        let onDeck;
        let sessionSize;
        weapon_of_logging.debug({
            message: "retrieving initial data",
            function: ServerCommunicationTypes_1.EmitTypes.GET_INITIAL,
        });
        initiative = (await db.retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
        [isSorted, onDeck, sessionSize] = await db.getSession(sessionId);
        if (isSorted) {
            if (initiative !== undefined) {
                initiative = init.resortInitiative(initiative);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE, async function (data) {
        let finalMessage;
        weapon_of_logging.debug({
            message: data.payload,
            function: "Create new socket receiver",
        });
        finalMessage = await db.addSingle(data.payload, data.sessionId, ServerCommunicationTypes_1.topLevelCollections.SESSIONS, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
        db.updateSession(data.sessionId, undefined, false);
        socket.broadcast
            .to(data.sessionId)
            .emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE, data.payload);
        if (finalMessage instanceof Error) {
            weapon_of_logging.alert({
                message: finalMessage.message,
                function: ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE,
                docId: data.payload.id,
            });
        }
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_INITIATIVE, async function (data) {
        if (data.docId !== undefined) {
            let finalMessage = await db.deleteSingle(data.docId, data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
            if (finalMessage instanceof Error) {
                weapon_of_logging.alert({
                    message: finalMessage.message,
                    function: ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_INITIATIVE,
                    docId: data.docId,
                });
            }
            let [isSorted, onDeck, sessionSize] = await db.getSession(data.sessionId);
            sessionSize -= 1;
            isSorted = false;
            onDeck = 0;
            let errorMsg = await db.updateSession(data.sessionId, onDeck, isSorted, sessionSize);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE, async function (sessionId) {
        try {
            await db.deleteCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.NEXT, async function (sessionId) {
        const [errorMsg, currentName, currentStatuses, currentId] = await (0, initiative_1.turnOrder)(sessionId, init.initiativeFunctionTypes.NEXT);
        weapon_of_logging.debug({
            message: "next turn and statuses retrieved",
            function: ServerCommunicationTypes_1.EmitTypes.NEXT,
            docId: currentId,
        });
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
        setTimeout(async () => {
            let record = await db.retrieveRecord(currentId, sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
            weapon_of_logging.info({
                message: record,
                function: ServerCommunicationTypes_1.EmitTypes.NEXT,
            });
            io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.NEXT, record);
            const statuses = (0, create_embed_1.statusEmbed)(currentName, currentStatuses);
            (0, util_1.channelSend)(client, { embeds: [statuses] }, sessionId);
        }, 300);
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.PREVIOUS, async function (sessionId) {
        const [errorMsg, currentName, currentStatuses, currentId] = await (0, initiative_1.turnOrder)(sessionId, init.initiativeFunctionTypes.PREVIOUS);
        if (errorMsg instanceof Error) {
            weapon_of_logging.alert({
                message: errorMsg.message,
                function: ServerCommunicationTypes_1.EmitTypes.PREVIOUS,
            });
        }
        setTimeout(async () => {
            let record = await db.retrieveRecord(currentId, sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
            weapon_of_logging.info({
                message: record,
                function: ServerCommunicationTypes_1.EmitTypes.PREVIOUS,
            });
            io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.PREVIOUS, record);
            const statuses = (0, create_embed_1.statusEmbed)(currentName, currentStatuses);
            (0, util_1.channelSend)(client, { embeds: [statuses] }, sessionId);
        }, 300);
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.RESORT, async function (sessionId, respond) {
        let initiativeList = (await db.retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
        try {
            initiativeList = init.resortInitiative(initiativeList);
            weapon_of_logging.info({
                message: "Resort Complete",
                function: ServerCommunicationTypes_1.EmitTypes.RESORT,
            });
            socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                payload: initiativeList,
                isSorted: true,
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
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_INITIATIVE, async function (data) {
        weapon_of_logging.debug({
            message: "updating one value",
            function: ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_INITIATIVE,
            docId: data.docId,
        });
        if (data.docId) {
            try {
                const newObject = Object.assign({
                    toUpdate: data.toUpdate,
                    docId: data.docId,
                });
                db.updateCollectionItem(newObject.toUpdate, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE, newObject.docId, data.sessionId, data.ObjectType);
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_INITIATIVE, {
                    toUpdate: data.toUpdate,
                    ObjectType: data.ObjectType,
                    docId: data.docId,
                });
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE, async function (data) {
        weapon_of_logging.debug({
            message: "updating one value",
            function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE,
            docId: data.payload.id,
        });
        try {
            await db.updatecollectionRecord(data.payload, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE, data.payload.id, data.sessionId);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, async function (data) {
        let isSorted;
        if (data.isSorted !== undefined) {
            isSorted = data.isSorted;
            weapon_of_logging.debug({
                message: `isSorted is: ${isSorted}`,
                function: "UPDATE_ALL SOCKET RECEIVER",
            });
        }
        try {
            await db.updateCollection(data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE, data.payload);
            setTimeout(async () => {
                let initiativeList = await db.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
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
                    let OnDeck;
                    if (initiativeList[trueIndex].roundOrder === initiativeList.length) {
                        OnDeck = 1;
                    }
                    else {
                        OnDeck = initiativeList[trueIndex].roundOrder + 1;
                    }
                    const errorMsg = db.updateSession(data.sessionId, OnDeck, undefined, initiativeList.length);
                    socket.broadcast
                        .to(data.sessionId)
                        .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                        payload: initiativeList,
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
                        isSorted: data.isSorted,
                    });
                }
            }, 200);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.ROUND_START, async function (sessionId, respond) {
        try {
            let initiativeList = await db.retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
            weapon_of_logging.debug({
                message: "starting round start, initiative retrieved",
                function: "ROUND_START SOCKET_RECEIVER",
            });
            initiativeList = await init.finalizeInitiative(initiativeList, true, sessionId);
            const startEmbed = (0, create_embed_1.initiativeEmbed)(initiativeList);
            (0, util_1.channelSend)(client, { embeds: [startEmbed], content: "Rounds have started" }, sessionId);
            weapon_of_logging.info({
                message: "initiative sorted and being emitted",
                function: "ROUND_START SOCKET_RECEIVER",
            });
            socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.ROUND_START);
            socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                payload: initiativeList,
                collectionType: ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE,
                isSorted: true,
            });
            respond(initiativeList);
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
    socket.on(ServerCommunicationTypes_1.EmitTypes.DISCORD_INITIATIVE, async function (data) {
        let sortedList;
        try {
            if (data.collectionType === ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE) {
                let newList = (await db.retrieveCollection(data.sessionId, data.collectionType));
                weapon_of_logging.info({
                    message: `retrieving ${data.collectionType} for discord embed`,
                    function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                });
                let [isSorted, onDeck, sessionSize] = await db.getSession(data.sessionId);
                if (isSorted) {
                    sortedList = (0, initiative_1.resortInitiative)(newList);
                }
                else {
                    sortedList = await init.finalizeInitiative(newList, false, data.sessionId);
                }
                let initEmbed = (0, create_embed_1.initiativeEmbed)(sortedList);
                (0, util_1.channelSend)(client, { embeds: [initEmbed] }, data.sessionId);
            }
            if (data.collectionType === ServerCommunicationTypes_1.secondLevelCollections.SPELLS) {
                let newList = (await db.retrieveCollection(data.sessionId, data.collectionType));
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
}
exports.default = initiativeSocket;
