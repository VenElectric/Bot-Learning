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
        .setName("next")
        .setDescription("Move turn order forward"),
    description: `Move the initiative order forward.`,
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.channel == null)
                return;
            if (interaction.command == null)
                return;
            const commandName = interaction.command.name;
            const sessionId = interaction.channel.id;
            try {
                sonic.emit("getInit", (init) => __awaiter(this, void 0, void 0, function* () {
                    const { isSorted, next, previous, sessionSize } = yield init.getSession(sessionId);
                    sonic.log("calculating next and previous", sonic.debug, commandName, next, previous);
                    const initiativeList = (yield init.retrieveCollection(sessionId));
                    const sortedList = yield init.resort(initiativeList);
                    const oldNextIndex = sonic.findIndexById(sortedList, next);
                    const oldPreviousIndex = sonic.findIndexById(sortedList, previous);
                    const oldNextNum = sortedList[oldNextIndex].roundOrder;
                    const oldPreviosNum = sortedList[oldPreviousIndex].roundOrder;
                    const newNextNum = (yield init.calcForward(oldNextNum, sessionSize));
                    const newPreviousNum = (yield init.calcForward(oldPreviosNum, sessionSize));
                    sonic.log("next and previous calculated", sonic.debug, commandName, {
                        newNext: newNextNum,
                        newPrev: newPreviousNum,
                        next: sortedList[newNextNum].id,
                        prev: sortedList[newPreviousNum].id,
                    });
                    init.setNext(sortedList[newNextNum].id, sessionId);
                    init.setPrevious(sortedList[newPreviousNum].id, sessionId);
                    sonic.emit("getDiscordClient", (client) => __awaiter(this, void 0, void 0, function* () {
                        const statuses = client.statusEmbed(sortedList[oldNextIndex].characterName, sortedList[oldNextIndex].statusEffects);
                        sonic.log("creating embed", sonic.debug, commandName);
                        sonic.emit("getIO", (ioC) => __awaiter(this, void 0, void 0, function* () {
                            ioC.io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.NEXT, sortedList[newNextNum]);
                            sonic.log("emitting next", sonic.debug, commandName);
                        }));
                        yield interaction.reply({ embeds: [statuses] });
                    }));
                }));
            }
            catch (error) {
                sonic.onError(error, commandName);
            }
        });
    },
};
