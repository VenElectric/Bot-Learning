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
const discord_js_1 = require("discord.js");
const constants_1 = require("../discord/constants");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help with commands"),
    description: "Select an option from the menu to get more information about the command.",
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandName = interaction.commandName;
            try {
                sonic.emit("getDiscordClient", (client) => __awaiter(this, void 0, void 0, function* () {
                    const helpMenu = client.retrieveMenu(constants_1.menuTypes.HELP);
                    const selectMenu = client.createSelectMenu(helpMenu, constants_1.menuTypes.HELP, "Nothing Selected");
                    const row = client.createActionRow(selectMenu);
                    yield interaction.reply({
                        content: "Select a command",
                        components: [row],
                    });
                }));
            }
            catch (error) {
                sonic.onError(error, commandName);
                yield interaction.reply("There was an error with this command.");
            }
        });
    },
};
