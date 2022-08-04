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
    name: ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_INITIATIVE,
    execute(io, socket, client, data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({
                message: "updating one value",
                function: ServerCommunicationTypes_1.EmitTypes.UPDATE_ITEM_INITIATIVE,
                docId: data.docId,
            });
            const { updateCollectionItem } = require("../../services/database-common");
            if (data.docId) {
                try {
                    const newObject = Object.assign({
                        toUpdate: data.toUpdate,
                        docId: data.docId,
                    });
                    updateCollectionItem(newObject.toUpdate, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE, newObject.docId, data.sessionId, data.ObjectType);
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
    },
};
