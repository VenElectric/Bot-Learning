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
    name: ServerCommunicationTypes_1.EmitTypes.GET_INITIAL,
    execute(io, socket, client, sessionId, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { retrieveCollection, getSession, } = require("../../services/database-common");
            const { resortInitiative } = require("../../services/initiative");
            let initiative;
            weapon_of_logging.debug({
                message: "retrieving initial data",
                function: ServerCommunicationTypes_1.EmitTypes.GET_INITIAL,
            });
            initiative = (yield retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
            const [isSorted, onDeck, sessionSize] = yield getSession(sessionId);
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
        });
    },
};
