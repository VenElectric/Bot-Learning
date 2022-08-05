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
            const commandName = interaction.commandName;
            const sessionId = interaction.channel.id;
            try {
                sonic.emit("getInit", (init) => __awaiter(this, void 0, void 0, function* () {
                    const { isSorted, next, previous, sessionSize } = yield init.getSession(sessionId);
                    sonic.log("calculating next and previous", sonic.debug, commandName, next, previous);
                    const initiativeList = (yield init.retrieveCollection(sessionId));
                    let sortedList = init.resort(initiativeList);
                    sortedList = init.resetisCurrent(sortedList);
                    const newCurrent = sonic.findIndexById(sortedList, next);
                    const oldPreviousIndex = sonic.findIndexById(sortedList, previous);
                    const newCurrentNum = sortedList[newCurrent].roundOrder;
                    const oldPreviosNum = sortedList[oldPreviousIndex].roundOrder;
                    const newNextNum = (yield init.calcForward(newCurrentNum, sessionSize));
                    const newPreviousNum = (yield init.calcForward(oldPreviosNum, sessionSize));
                    const newNextIndex = init.findIndexByRoundOrder(sortedList, newNextNum);
                    const newPrevIndex = init.findIndexByRoundOrder(sortedList, newPreviousNum);
                    sortedList[newCurrent].isCurrent = true;
                    sonic.log("next and previous calculated", sonic.debug, commandName, {
                        newNext: newNextNum,
                        newPrev: newPreviousNum,
                        next: sortedList[newNextIndex].id,
                        prev: sortedList[newPrevIndex].id,
                    });
                    yield init.setNext(sortedList[newNextIndex].id, sessionId);
                    yield init.setPrevious(sortedList[newPrevIndex].id, sessionId);
                    init.updateCollection(sessionId, sortedList);
                    sonic.emit("getDiscordClient", (client) => __awaiter(this, void 0, void 0, function* () {
                        const statuses = client.statusEmbed(sortedList[newCurrent].characterName, sortedList[newCurrent].statusEffects);
                        sonic.log("creating embed", sonic.debug, commandName);
                        sonic.emit("getIO", (ioC) => __awaiter(this, void 0, void 0, function* () {
                            ioC.io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.NEXT, sortedList[newCurrent]);
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
