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
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE,
    execute(socket, sonic, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                sonic.emit("getInit", (init) => __awaiter(this, void 0, void 0, function* () {
                    yield init.addDoc(data.payload, data.sessionId);
                    sonic.log("adding document for init", sonic.info, ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE);
                    yield init.setisSorted(false, data.sessionId);
                    socket.broadcast
                        .to(data.sessionId)
                        .emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE, data.payload);
                }));
            }
            catch (error) {
                sonic.onError(error, ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE);
            }
        });
    },
};
