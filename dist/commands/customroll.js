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
        .setName("customroll")
        .setDescription("Create a custom roll")
        .addStringOption((option) => option
        .setName("roll")
        .setDescription("The dice to roll with any modifiers. I.E. d20+3")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("rollname")
        .setDescription("Name for custom roll")
        .setRequired(true)),
    description: "Create a custom roll for yourself that you can use. Comments can be included. Example format: d20+3 Attack Roll",
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.channel == null)
                return;
            const commandName = interaction.commandName;
            const sessionId = interaction.channel.id;
            const customRoll = interaction.options
                .getString("roll", true)
                .toLowerCase();
            const rollName = interaction.options.getString("rollname", true);
            try {
                sonic.emit("getDice", (roller) => __awaiter(this, void 0, void 0, function* () {
                    if (!roller.isValidRoll(customRoll)) {
                        yield interaction.reply(`Incorrect format for dice roll. Format should be the die to be rolled + any modifiers. I.E. d20+3 or 2d4+5. \n You tried to add: ${customRoll}`);
                    }
                    else {
                        const rollObject = {
                            rollName: rollName,
                            id: String(sonic.uuid()),
                            rollValue: customRoll,
                        };
                        sonic.log("adding roll to db", sonic.info, commandName);
                        yield roller.addDoc(rollObject, sessionId);
                        sonic.emit("getIO", (ioClass) => __awaiter(this, void 0, void 0, function* () {
                            sonic.log("emitting roll to client side", sonic.info, commandName);
                            ioClass.io
                                .to(sessionId)
                                .emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_ROLL, rollObject);
                        }));
                        yield interaction.reply("Custom Roll added successfully.");
                    }
                }));
            }
            catch (error) {
                if (interaction.command !== null) {
                    sonic.onError(error, interaction.command.name, customRoll, rollName);
                }
                yield interaction.reply("There was an error with the command");
            }
        });
    },
};
