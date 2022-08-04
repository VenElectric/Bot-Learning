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
        .setName("resort")
        .setDescription("Resort initiative and keep turn order."),
    description: `Resort the initiative if you have added or removed characters. Use this if you don't want to reset whose turn in the initiative order it is.`,
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
                    const initiativeList = yield init.retrieveCollection(sessionId);
                    const sortedList = init.resort(initiativeList);
                    sonic.emit("getDiscordClient", (client) => __awaiter(this, void 0, void 0, function* () {
                        const embed = client.initiativeEmbed(sortedList);
                        sonic.emit("getIO", (ioC) => __awaiter(this, void 0, void 0, function* () {
                            ioC.io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, { payload: sortedList, isSorted: true });
                        }));
                        yield interaction.reply({
                            content: "Initiative has been resorted.",
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
