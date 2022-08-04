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
const index_1 = require("../../index");
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE,
    once: false,
    execute(data, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_1.initDB.addDoc(data, sessionId);
            index_1.ioClass.io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE, { payload: data, sessionId: sessionId });
        });
    },
};
