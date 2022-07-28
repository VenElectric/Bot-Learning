"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE,
    async execute(io, socket, client, data) {
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
            await updateCollection(data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE, data.payload);
            setTimeout(async () => {
                let initiativeList = (await retrieveCollection(data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
                if (data.isSorted !== undefined) {
                    if (data.isSorted) {
                        weapon_of_logging.debug({
                            message: `data.isSorted is: ${data.isSorted}`,
                            function: "UPDATE_ALL SOCKET RECEIVER",
                        });
                        initiativeList = resortInitiative(initiativeList);
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
    },
};
