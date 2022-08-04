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
// import {commands} from "../index";
module.exports = {
    name: 'interactionCreate',
    once: false,
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isUserContextMenuCommand())
                return;
            // Get the User's username from context menu
            const name = interaction.targetUser.username;
            console.log(name);
            yield interaction.reply("Testing, thank you");
        });
    },
};
