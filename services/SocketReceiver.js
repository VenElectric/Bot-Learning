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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketReceiver = void 0;
const LoggingClass_1 = require("../utilities/LoggingClass");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const TypeChecking_1 = require("../utilities/TypeChecking");
const LoggingTypes_1 = require("../Interfaces/LoggingTypes");
const dbCall = __importStar(require("./database-common"));
const initiativeFunctions = __importStar(require("../services/initiative"));
const create_embed_1 = require("./create-embed");
const chalk_1 = __importDefault(require("chalk"));
// {sessionId: sessionId, payload: payload, collectionType: collectionType}
// add in client  client.channels.fetch(sessionId).then((channel: any) => {
//   channel.send(
//    data.....
// channel.execute?
//   );
// });
function socketReceiver(socket, client) {
    socket.on("test", (data) => {
        console.log("test");
    });
    socket.on(LoggingTypes_1.LoggingTypes.DEBUG, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield LoggingClass_1.weapon_of_logging.DEBUG(data.payload.infoName, data.payload.infoMessage, data.payload.data);
            respond(response);
        });
    });
    // LOGGING SOCKETS
    socket.on(LoggingTypes_1.LoggingTypes.INFO, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield LoggingClass_1.weapon_of_logging.INFO(data.payload.infoName, data.payload.infoMessage, data.payload.data);
            respond(response);
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.CRITICAL, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield LoggingClass_1.weapon_of_logging.CRITICAL(data.payload.errorName, data.payload.errorMessage, data.payload.stackTrace, data.payload.data);
            respond(response);
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.ALERT, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield LoggingClass_1.weapon_of_logging.ALERT(data.payload.errorName, data.payload.errorMessage, data.payload.stackTrace, data.payload.data);
            respond(response);
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.EMERGENCY, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield LoggingClass_1.weapon_of_logging.EMERGENCY(data.payload.errorName, data.payload.errorMessage, data.payload.stackTrace, data.payload.data);
            respond(response);
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.ERROR, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield LoggingClass_1.weapon_of_logging.ERROR(data.payload.errorName, data.payload.errorMessage, data.payload.stackTrace, data.payload.data);
            respond(response);
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.NOTICE, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield LoggingClass_1.weapon_of_logging.NOTICE(data.payload.errorName, data.payload.errorMessage, data.payload.data);
            respond(response);
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.WARN, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("here I am");
            let response = yield LoggingClass_1.weapon_of_logging.WARN(data.payload.errorName, data.payload.errorMessage, data.payload.data);
            respond(response);
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
                yield LoggingClass_1.weapon_of_logging.ERROR(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage = yield dbCall.deleteSingle(data.payload, data.sessionId, data.collectionType);
            if (finalMessage instanceof Error) {
                yield LoggingClass_1.weapon_of_logging.ERROR(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
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
            LoggingClass_1.weapon_of_logging.DEBUG("initial data", "getting data", data);
            if (data.sessionId !== undefined) {
                initiative = yield dbCall.retrieveCollection(data.sessionId, data.collectionType);
                [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
            }
            if (initiative instanceof Error) {
                LoggingClass_1.weapon_of_logging.DEBUG(initiative.name, initiative.message, initiative.stack);
                // await weapon_of_logging.ERROR(
                //   initiative.name,
                //   initiative.message,
                //   initiative.stack,
                //   data.payload,
                //   data.sessionId
                // );
            }
            // await weapon_of_logging.INFO(
            //   "finalMessage",
            //   initiative,
            //   data.payload,
            //   data.sessionId
            // );
            LoggingClass_1.weapon_of_logging.DEBUG(ServerCommunicationTypes_1.EmitTypes.GET_INITIAL, `Successfully retrieved initial data of type ${data.collectionType}`, data);
            respond({ initiativeList: initiative, isSorted: isSorted });
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.NEXT, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage = yield initiativeFunctions.turnOrder(data.sessionId, initiativeFunctions.initiativeFunctionTypes.NEXT);
            if (finalMessage instanceof Error) {
                yield LoggingClass_1.weapon_of_logging.ERROR(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
            }
            yield LoggingClass_1.weapon_of_logging.INFO("finalMessage", "Succesfully retrieved NEXT", data);
            let initiativeList = yield dbCall.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
            socket.broadcast
                .to(data.sessionId)
                .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, initiativeList);
            if (finalMessage instanceof Error) {
                yield LoggingClass_1.weapon_of_logging.ERROR(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
            }
            respond(finalMessage);
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.PREVIOUS, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalMessage = yield initiativeFunctions.turnOrder(data.sessionId, initiativeFunctions.initiativeFunctionTypes.PREVIOUS);
            if (finalMessage instanceof Error) {
                yield LoggingClass_1.weapon_of_logging.ERROR(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
            }
            let initiativeList = yield dbCall.retrieveCollection(data.sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
            socket.broadcast
                .to(data.sessionId)
                .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, initiativeList);
            if (finalMessage instanceof Error) {
                yield LoggingClass_1.weapon_of_logging.ERROR(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
            }
            else {
                LoggingClass_1.weapon_of_logging.INFO("finalMessage", "successfully sent previous", data);
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
                    yield LoggingClass_1.weapon_of_logging.ERROR(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
                }
                respond(finalMessage);
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.RE_ROLL, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, TypeChecking_1.isInitiativeObject)(data.payload)) {
                let finalMessage = yield dbCall.updatecollectionRecord(data.payload, data.collectionType, data.payload.id, data.sessionId);
                let newList = yield dbCall.retrieveCollection(data.sessionId, data.collectionType);
                socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, newList);
                if (finalMessage instanceof Error) {
                    yield LoggingClass_1.weapon_of_logging.ERROR(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
                }
                respond(finalMessage);
            }
            else {
                respond(`Invalid Collection Type. Type Sent: ${data.collectionType}`);
            }
        });
    });
    socket.on(ServerCommunicationTypes_1.EmitTypes.UPDATE_ONE, function (data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            LoggingClass_1.weapon_of_logging.DEBUG("update one", "initial data at the beginning", data);
            console.log(chalk_1.default.cyanBright(data.id));
            try {
                dbCall.updateCollectionItem(data.toUpdate, data.CollectionType, data.id, data.sessionId, data.ObjectType);
            }
            catch (error) {
                console.log(error);
            }
            let finalMessage = yield dbCall.retrieveCollection(data.sessionId, data.CollectionType);
            if (finalMessage instanceof Error) {
                yield LoggingClass_1.weapon_of_logging.ERROR(finalMessage.name, finalMessage.message, finalMessage.stack, data.payload);
            }
            let newList = yield dbCall.retrieveCollection(data.sessionId, data.CollectionType);
            socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ONE, newList);
            respond(finalMessage);
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
                            LoggingClass_1.weapon_of_logging.ALERT(finalMessage.name, `${finalMessage.message} : Record was not uploaded`, finalMessage.stack, data.payload);
                            failures.push(record.id);
                        }
                        else {
                            LoggingClass_1.weapon_of_logging.INFO(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, `${data.collectionType} was updated successfully`, data.payload);
                            successes.push(record.id);
                        }
                    }
                    catch (error) {
                        if (error instanceof Error) {
                            LoggingClass_1.weapon_of_logging.ALERT(error.name, error.message, error.stack, data.payload);
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
                LoggingClass_1.weapon_of_logging.INFO("initiativeList", "Starting sort for round start", data);
                if ((0, TypeChecking_1.isInitiativeObjectArray)(initiativeList)) {
                    let [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
                    let finalMessage = yield initiativeFunctions.finalizeInitiative(initiativeList, true, data.sessionId, onDeck, isSorted);
                    console.log(chalk_1.default.bgRedBright(finalMessage));
                    LoggingClass_1.weapon_of_logging.INFO("initiativeList Sort", "successfully sorted Initiative", data);
                    socket.broadcast
                        .to(data.sessionId)
                        .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL, finalMessage);
                    respond(finalMessage);
                }
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    LoggingClass_1.weapon_of_logging.NOTICE(error.name, error.message, data);
                    respond("No initiative to sort. Please add in initiative");
                }
                else if (error instanceof Error &&
                    !(error instanceof ReferenceError)) {
                    yield LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, data.payload);
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
                    LoggingClass_1.weapon_of_logging.INFO(ServerCommunicationTypes_1.EmitTypes.DISCORD, "getting initiative list", newList);
                    let [isSorted, onDeck, sessionSize] = yield dbCall.getSession(data.sessionId);
                    sortedList = yield initiativeFunctions.finalizeInitiative(newList, isSorted, data.sessionId, onDeck, isSorted);
                    let initEmbed = (0, create_embed_1.initiativeEmbed)(sortedList);
                    client.channels.fetch(data.sessionId).then((channel) => {
                        channel.send({ embeds: [initEmbed] });
                        LoggingClass_1.weapon_of_logging.INFO("ChannelSend", "success", sortedList);
                        respond(200);
                    });
                }
                if (data.collectionType === ServerCommunicationTypes_1.collectionTypes.SPELLS) {
                    let newList = (yield dbCall.retrieveCollection(data.sessionId, data.collectionType));
                    LoggingClass_1.weapon_of_logging.INFO(ServerCommunicationTypes_1.EmitTypes.DISCORD, "getting initiative list", newList);
                    let spellsEmbed = (0, create_embed_1.spellEmbed)(newList);
                    client.channels.fetch(data.sessionId).then((channel) => {
                        channel.send({ embeds: [spellsEmbed] });
                        LoggingClass_1.weapon_of_logging.INFO("ChannelSend", "success", data);
                        respond(200);
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    LoggingClass_1.weapon_of_logging.CRITICAL(error.name, error.message, error.stack, data);
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
