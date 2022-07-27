"use strict";
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
        .then(async () => {
        return true;
    }).catch((error) => {
        return error;
    });
}
function update_character() {
}
function delete_character() {
}
async function getCharacterList(userId) {
    await initRef.doc(userId).collection();
}
