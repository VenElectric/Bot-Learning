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
const { db } = require("./firebase-setup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection('users');
function add_character(user_id, pcargs) {
    let pcid = uuidv4();
    let options = {
        id: pcid,
        name: pcargs[0]
    };
    initRef.doc(user_id).collection('characters').doc(pcid)
        .set(options)
        .then(() => __awaiter(this, void 0, void 0, function* () {
        return true;
    })).catch((error) => {
        return error;
    });
}
function update_character() {
}
function delete_character() {
}
