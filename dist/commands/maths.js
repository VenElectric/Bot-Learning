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
const diceRegex = new RegExp(/(\/|\/[a-z]|\/[A-Z]|r)*\s*([d|D])([\d])+/);
module.exports = {
    data: new SlashCommandBuilder()
        .setName("maths")
        .setDescription("1+1 = ?"),
    description: `Do some basic math. 1+1 = ? \n You can also send a math equation without using the slash command.`,
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.command == null)
                return;
            const commandName = interaction.command.name;
            try {
                if (interaction.content.match(diceRegex)) {
                    const rollCom = commands.get("roll");
                    rollCom === null || rollCom === void 0 ? void 0 : rollCom.execute(commands, interaction);
                }
                else {
                    const answer = sonic.eval(interaction.content);
                    sonic.log("evaluation complete", sonic.debug, commandName);
                    yield interaction.reply(`Answer: ${answer}`);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    sonic.onError(error, commandName, interaction.content);
                    yield interaction.reply(error.message);
                }
            }
        });
    },
};
