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
const { SlashCommandBuilder } = require("@discordjs/builders");
const { db } = require("../services/firebase-setup");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearsessionlist")
        .setDescription("Clear all initiative and spells for this session."),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sessionId = interaction.channel.id;
                const initRef = db.collection('sessions').doc(sessionId);
                const initSnapshot = yield initRef.collection("initiative").get();
                const spellSnapshot = yield initRef.collection("spells").get();
                const batch = db.batch();
                initRef.set({ isSorted: false, onDeck: 0, sessionSize: 0 }, { merge: true }).then(() => {
                    weapon_of_logging.debug({ message: "reset of session values successufl", function: "clearsessionlist" });
                }).catch((error) => {
                    if (error instanceof Error) {
                        weapon_of_logging.alert({ message: "error resetting session values", function: "clearsessionlist" });
                    }
                });
                initSnapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                spellSnapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                yield batch.commit();
                weapon_of_logging.debug({ message: "reset of spells and initiative", function: "clearsessionlist" });
                yield interaction.reply("Reset Complete");
            }
            catch (error) {
                console.log("error", error);
            }
        });
    },
};
