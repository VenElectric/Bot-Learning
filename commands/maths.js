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
const { evaluate } = require('mathjs');
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("maths")
        .setDescription("1+1 = ?"),
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let answer = evaluate(message.content);
                weapon_of_logging.info({ message: "math calculation completed", function: "maths" });
                yield message.reply(`Answer: ${answer}`);
            }
            catch (error) {
                if (error instanceof Error) {
                    yield message.reply(error.message);
                    weapon_of_logging.error(error.name, error.message, error.stack, message.content);
                }
            }
        });
    },
};
