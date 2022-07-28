"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.GET_INITIAL,
    async execute(io, socket, client, sessionId, respond) {
        const { retrieveCollection, getSession, } = require("../../services/database-common");
        const { resortInitiative } = require("../../services/initiative");
        let initiative;
        weapon_of_logging.debug({
            message: "retrieving initial data",
            function: ServerCommunicationTypes_1.EmitTypes.GET_INITIAL,
        });
        initiative = (await retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
        const [isSorted, onDeck, sessionSize] = await getSession(sessionId);
        if (isSorted) {
            if (initiative !== undefined) {
                initiative = resortInitiative(initiative);
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
    },
};
