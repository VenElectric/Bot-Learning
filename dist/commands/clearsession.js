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
const { SlashCommandBuilder } = require("discord.js");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearsessionlist")
        .setDescription("Clear all initiative and spells for this session."),
    description: `Remove all initiative records (names, initiative, modifiers) and spell effects. No turning back from this!`,
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.channel == null)
                return;
            const sessionId = interaction.channel.id;
            const commandName = interaction.commandName;
            try {
                sonic.emit("getIO", (ioC) => __awaiter(this, void 0, void 0, function* () {
                    sonic.emit("getInit", (init) => __awaiter(this, void 0, void 0, function* () {
                        sonic.log("deleting initiative", sonic.debug, commandName);
                        yield init.deleteCollection(sessionId);
                        ioC.io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE);
                    }));
                    sonic.emit("getSpell", (spell) => __awaiter(this, void 0, void 0, function* () {
                        sonic.log("deleting spells", sonic.debug, commandName);
                        yield spell.deleteCollection(sessionId);
                        ioC.io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_SPELL);
                    }));
                    yield interaction.reply("Spells and Initiative are reset");
                }));
            }
            catch (error) {
                sonic.onError(error, commandName);
                yield interaction.reply("There was an error resetting your session.");
            }
        });
    },
};
