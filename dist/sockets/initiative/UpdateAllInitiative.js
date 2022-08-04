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
    name: ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE,
    execute(io, socket, client, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resortInitiative } = require("../../services/initiative");
            const { updateCollection, retrieveCollection, updateSession, } = require("../../services/database-common");
            let isSorted;
            if (data.isSorted !== undefined) {
                isSorted = data.isSorted;
                weapon_of_logging.debug({
                    message: `isSorted is: ${isSorted}`,
                    function: "UPDATE_ALL SOCKET RECEIVER",
                });
            }
            try {
                yield updateCollection(data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE, data.payload);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    let initiativeList = (yield retrieveCollection(data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
                    if (data.isSorted !== undefined) {
                        if (data.isSorted) {
                            weapon_of_logging.debug({
                                message: `data.isSorted is: ${data.isSorted}`,
                                function: "UPDATE_ALL SOCKET RECEIVER",
                            });
                            initiativeList = resortInitiative(initiativeList);
                        }
                    }
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
                    const errorMsg = updateSession(data.sessionId, OnDeck, undefined, initiativeList.length);
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
    },
};
