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
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    name: "interactionCreate",
    once: false,
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isChatInputCommand())
                return;
            const command = commands.get(interaction.commandName);
            if (!command) {
                return;
            }
            try {
                yield command.execute(commands, sonic, interaction);
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    weapon_of_logging.warning({
                        message: error.message,
                        function: "interactioncreate for slash commands",
                    });
                }
                yield interaction.reply({
                    content: "There was an error while executing this command!",
                });
            }
        });
    },
};
