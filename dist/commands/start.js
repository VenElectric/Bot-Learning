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
        .setName("start")
        .setDescription("Start Initiative and reset turn order."),
    description: `Start rounds and sort initiative. Use this if you are just starting initiative or if you want to restart from the top of the initiative order.`,
    execute(ccommands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.channel == null)
                return;
            const commandName = interaction.commandName;
            const sessionId = interaction.channel.id;
            try {
                sonic.emit("getInit", (init) => __awaiter(this, void 0, void 0, function* () {
                    const initiativeList = (yield init.retrieveCollection(sessionId));
                    const sortedList = yield init.roundStart(initiativeList);
                    const sessionSize = sortedList.length;
                    const nextId = sortedList[1].id;
                    const prevId = sortedList[sessionSize - 1].id;
                    console.log(sortedList, "roundstart");
                    init.setNext(nextId, sessionId);
                    init.setPrevious(prevId, sessionId);
                    init.setisSorted(true, sessionId);
                    init.setsessionSize(sessionSize, sessionId);
                    init.updateCollection(sessionId, sortedList);
                    sonic.emit("getDiscordClient", (client) => __awaiter(this, void 0, void 0, function* () {
                        const embed = client.initiativeEmbed(sortedList);
                        sonic.emit("getIO", (ioC) => __awaiter(this, void 0, void 0, function* () {
                            ioC.io
                                .to(sessionId)
                                .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                                payload: sortedList,
                                isSorted: true,
                            });
                            ioC.io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.ROUND_START);
                        }));
                        yield interaction.reply({
                            content: "Rounds have been started.",
                            embeds: [embed],
                        });
                    }));
                }));
            }
            catch (error) {
                sonic.onError(error, commandName);
            }
        });
    },
};
