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
const initiativeFunctions = __importStar(require("../services/initiative"));
const create_embed_1 = require("./create-embed");
// {sessionId: sessionId, payload: payload, collectionType: collectionType}
// add in client  client.channels.fetch(sessionId).then((channel: any) => {
//   channel.send(
//    data.....
// channel.execute?
//   );
// });
function socketReceiver(socket, client) {
    socket.on(LoggingTypes_1.LoggingTypes.DEBUG, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({ message: data.message, function: data.function });
        });
    });
    // LOGGING SOCKETS
    socket.on(LoggingTypes_1.LoggingTypes.INFO, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.info({ message: data.message, function: data.function });
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.ERROR, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.error({ message: data.message, function: data.function });
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.WARN, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.warn({ message: data.message, function: data.function });
        });
    });
    // DATABASE/INITIATIVE/SPELL SOCKETS
    socket.on(ServerCommunicationTypes_1.EmitTypes.REMOVE_STATUS_EFFECT, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () { });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.ADD_STATUS_EFFECT, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () { });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage;
            if ((0, TypeChecking_1.isInitiativeObject)(data.payload)) {
                finalMessage = yield dbCall.addSingle(data.payload, data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ONE, data.payload);
                respond(finalMessage);
            }
            if ((0, TypeChecking_1.isSpellObject)(data.payload)) {
                finalMessage = yield dbCall.addSingle(data.payload, data.sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS);
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW, data.payload);
                respond(finalMessage);
            }
            else {
                finalMessage = `Invalid Collection Type. Type Sent: ${data.collectionType}`;
                respond(finalMessage);
            }
            if (finalMessage instanceof Error) {
                weapon_of_logging.error({ message: finalMessage.message, function: "create_new SocketReceiver" });
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage = yield dbCall.deleteSingle(data.payload, data.sessionId, data.collectionType);
            if (finalMessage instanceof Error) {
                weapon_of_logging.error({ message: finalMessage.message, function: "DELETE_ONE SocketReceiver" });
            }
            let newList = yield dbCall.retrieveCollection(data.sessionId, data.collectionType);
            socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, newList);
            respond(finalMessage);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.GET_INITIAL, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let sessionId = data.sessionId;
            let initiative;
            let isSorted;
            let onDeck;
            let sessionSize;
            weapon_of_logging.debug({ message: "retrieving initial data", function: "GET_INITIAL SOCKET RECEIVER" });
            if (data.sessionId !== undefined) {
                initiative = yield dbCall.retrieveCollection(data.sessionId, data.collectionType);
                [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
            }
            if (initiative instanceof Error) {
                weapon_of_logging.error({ message: initiative.message, function: "GET_INITIAL SOCKET RECEIVER" });
            }
            weapon_of_logging.debug({ message: "succesfully retrieved initiative", function: "GET_INITIAL SOCKET RECEIVER" });
            respond({ initiativeList: initiative, isSorted: isSorted });
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.NEXT, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage = yield initiativeFunctions.turnOrder(data.sessionId, initiativeFunctions.initiativeFunctionTypes.NEXT);
            if (finalMessage instanceof Error) {
                weapon_of_logging.error(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
            }
            weapon_of_logging.info({ message: "succesfully retrieved next", function: "NEXT SOCKET RECEIVER" });
            let initiativeList = yield dbCall.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
            socket.broadcast
                .to(data.sessionId)
                .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, initiativeList);
            if (finalMessage instanceof Error) {
                weapon_of_logging.error({ message: finalMessage.message, function: "NEXT SOCKET RECEIVER" });
            }
            respond(finalMessage);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.PREVIOUS, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage = yield initiativeFunctions.turnOrder(data.sessionId, initiativeFunctions.initiativeFunctionTypes.PREVIOUS);
            if (finalMessage instanceof Error) {
                weapon_of_logging.error({ message: finalMessage.message, function: "PREVIOUS SOCKET RECEIVER" });
            }
            let initiativeList = yield dbCall.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
            socket.broadcast
                .to(data.sessionId)
                .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, initiativeList);
            if (finalMessage instanceof Error) {
                weapon_of_logging.error({ message: finalMessage.message, function: "PREVIOUS SOCKET RECEIVER" });
            }
            else {
                weapon_of_logging.info({ message: "succesfully retrieved previous", function: "NEXT SOCKET RECEIVER" });
            }
            respond(finalMessage);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.RESORT, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let initiativeList = yield dbCall.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
            if ((0, TypeChecking_1.isInitiativeObjectArray)(initiativeList)) {
                let finalMessage = initiativeFunctions.resortInitiative(initiativeList);
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, finalMessage);
                if (finalMessage instanceof Error) {
                    weapon_of_logging.error({ message: finalMessage.message, function: "RESORT SOCKET RECEIVER" });
                }
                respond(finalMessage);
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.RE_ROLL, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let initiativeList = data.payload;
            let docId = data.sessionId;
            let finalMessage = yield dbCall.updatecollectionRecord(initiativeList, data.collectionType, docId, data.sessionId);
            let newList = yield dbCall.retrieveCollection(data.sessionId, data.collectionType);
            socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, newList);
            if (finalMessage instanceof Error) {
                weapon_of_logging.error({ message: finalMessage.message, function: "REROLL SOCKET RECEIVER" });
            }
            respond(finalMessage);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ONE, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({ message: "updating one value", function: "UPDATE ONE SOCKET RECEIVER" });
            try {
                dbCall.updateCollectionItem(data.toUpdate, data.CollectionType, data.id, data.sessionId, data.ObjectType);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.error({ message: error.message, function: "UPDATE_ONE SOCKET RECEIVER" });
                }
                let finalMessage = yield dbCall.retrieveCollection(data.sessionId, data.CollectionType);
                if (finalMessage instanceof Error) {
                    weapon_of_logging.error({ message: finalMessage.message, function: "UPDATE_ONE SOCKET RECEIVER" });
                }
                let newList = yield dbCall.retrieveCollection(data.sessionId, data.CollectionType);
                socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ONE, newList);
                respond(finalMessage);
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let failures = [];
            let successes = [];
            if (data.collectionType != ServerCommunicationTypes_1.collectionTypes.INITIATIVE ||
                ServerCommunicationTypes_1.collectionTypes.SPELLS) {
                respond(`Invalid Collection Type. Type Sent: ${data.collectionType}`);
            }
            if ((0, TypeChecking_1.isInitiativeObjectArray)(data.payload) ||
                (0, TypeChecking_1.isSpellObjectArray)(data.payload)) {
                for (let record of data.payload) {
                    try {
                        let finalMessage = yield dbCall.updatecollectionRecord(record, data.collectionType, record.id, data.sessionId);
                        if (finalMessage instanceof Error) {
                            weapon_of_logging.ALERT({ message: finalMessage.message, function: "UPDATE_ALL SOCKET RECEIVER" });
                            failures.push(record.id);
                        }
                        else {
                            weapon_of_logging.info({ message: "Collection was updated successfully", function: "UPDATE_ALL SOCKET RECEIVER" });
                            successes.push(record.id);
                        }
                    }
                    catch (error) {
                        if (error instanceof Error) {
                            weapon_of_logging.error({ message: error.message, function: "UPDATE_ALL SOCKET RECEIVER" });
                            continue;
                        }
                    }
                }
                respond({ successes: successes, failures: failures });
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.ROUND_START, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.collectionType != ServerCommunicationTypes_1.collectionTypes.INITIATIVE) {
                respond(`Invalid Collection Type. Type Sent: ${data.collectionType}`);
            }
            try {
                let initiativeList = yield dbCall.retrieveCollection(data.sessionId, data.collectionType);
                weapon_of_logging.debug({ message: "starting round start, initiative retrieved", function: "ROUND_START SOCKET_RECEIVER" });
                if ((0, TypeChecking_1.isInitiativeObjectArray)(initiativeList)) {
                    let [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
                    let finalMessage = yield initiativeFunctions.finalizeInitiative(initiativeList, true, data.sessionId, onDeck, isSorted);
                    weapon_of_logging.info({ message: "initiative sorted and being emitted", function: "ROUND_START SOCKET_RECEIVER" });
                    socket.broadcast
                        .to(data.sessionId)
                        .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, finalMessage);
                    respond(finalMessage);
                }
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    weapon_of_logging.warn({ message: error.message, function: "ROUND_START SOCKET_RECEIVER" });
                    respond("No initiative to sort. Please add in initiative");
                }
                else if (error instanceof Error &&
                    !(error instanceof ReferenceError)) {
                    weapon_of_logging.error({ message: error.message, function: "ROUND_START SOCKET_RECEIVER" });
                }
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DISCORD, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortedList;
            try {
                if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.INITIATIVE) {
                    let newList = (yield dbCall.retrieveCollection(data.sessionId, data.collectionType));
                    weapon_of_logging.info({ message: `retrieving ${data.collectionType} for discord embed`, function: "DISCORD SOCKET_RECEIVER" });
                    let [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
                    sortedList = yield initiativeFunctions.finalizeInitiative(newList, isSorted, data.sessionId, onDeck, isSorted);
                    let initEmbed = (0, create_embed_1.initiativeEmbed)(sortedList);
                    client.channels.fetch(data.sessionId).then((channel) => {
                        channel.send({ embeds: [initEmbed] });
                        weapon_of_logging.info({ message: "sending initiative to discord channel success", function: "DISCORD SOCKET_RECEIVER" });
                        respond(200);
                    });
                }
                if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.SPELLS) {
                    let newList = (yield dbCall.retrieveCollection(data.sessionId, data.collectionType));
                    weapon_of_logging.info({ message: `retrieving ${data.collectionType} for discord embed`, function: "DISCORD SOCKET_RECEIVER" });
                    let spellsEmbed = (0, create_embed_1.spellEmbed)(newList);
                    client.channels.fetch(data.sessionId).then((channel) => {
                        channel.send({ embeds: [spellsEmbed] });
                        weapon_of_logging.info({ message: "sending spells to discord channel success", function: "DISCORD SOCKET_RECEIVER" });
                        respond(200);
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.error({ message: error.message, function: "DISCORD SOCKET_RECEIVER" });
                    respond(error);
                }
            }
        });
    });
    //just in case I need it....
    // socket.on("GET_INITIAL_INIT", async (sessionId: any, respond: any) => {
    //   console.log("GET_INITIAL_INIT");
    //   let initiativeList = await retrieveCollection(
    //     sessionId,
    //     initiativeCollection
    //   );
    //   let [isSorted, onDeck, sessionSize] = await getSession(sessionId);
    //   console.log(isSorted, onDeck, sessionSize);
    //   respond({
    //     initiativeList: initiativeList,
    //     spellList: [],
    //     isSorted: isSorted,
    //     onDeck: onDeck,
    //     sessionId,
    //   });
    // });
    // socket.on("GET_INITIAL_SPELLS", async (sessionId: any, respond: any) => {
    //   let spellList = await retrieveCollection(sessionId, spellCollection);
    //   console.log("get initial spells");
    //   respond(spellList);
    // });
    // socket.on(EmitTypes.CREATE_NEW, async (dataList: any, respond: any) => {
    //   console.log(dataList);
    //   let response;
    //   try {
    //     await addSingle(
    //       dataList.payload,
    //       dataList.sessionId,
    //       dataList.collectionType
    //     );
    //     console.log("success");
    //     response = 200;
    //   } catch (error) {
    //     console.log(error);
    //     response = error;
    //   }
    //   respond(response);
    // });
    // socket.on(EmitTypes.ROUND_START, async (sessionId: any, respond: any) => {
    //   let initiativeList = await retrieveCollection(
    //     sessionId,
    //     initiativeCollection
    //   );
    //   let [isSorted, onDeck, sessionSize] = await getSession(sessionId);
    //   let sortedList = await finalizeInitiative(
    //     initiativeList as InitiativeObject[],
    //     true,
    //     sessionId,
    //     onDeck,
    //     isSorted
    //   );
    //   socket.broadcast.to(sessionId).emit(EmitTypes.ROUND_START, {
    //     initiativeList: sortedList,
    //     isSorted: isSorted,
    //     sessionSize: sessionSize,
    //     onDeck: onDeck,
    //   });
    //   respond({
    //     initiativeList: sortedList,
    //     isSorted: isSorted,
    //     sessionSize: sessionSize,
    //     onDeck: onDeck,
    //   });
    // });
}
exports.socketReceiver = socketReceiver;
