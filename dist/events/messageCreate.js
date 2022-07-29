"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
// import {commands} from "../index";
module.exports = {
    name: "messageCreate",
    once: false,
    execute(commands, interaction) {
        const diceRegex = new RegExp(/^(\/|\/[a-z]|\/[A-Z]|r)*\s*(\d)*\s*([d|D])([\d])+/);
        const mathRegex = new RegExp(/^([-+]?[0-9]*\.?[0-9]+[\/\+\-\*])+([-+]?[0-9]*\.?[0-9]+)/);
        if (interaction.author.bot)
            return;
        if (!interaction.content.match(diceRegex) && !interaction.content.match(mathRegex))
            return;
        const rollcom = commands.get("roll");
        const mathcom = commands.get("maths");
        try {
            if (interaction.content.match(mathRegex)) {
                if (mathcom) {
                    mathcom.execute(commands, interaction);
                }
            }
            if (interaction.content.match(diceRegex)) {
                if (rollcom) {
                    rollcom.execute(commands, interaction);
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: "messagecreate",
                });
                console.error(error);
                return;
            }
        }
    },
};
