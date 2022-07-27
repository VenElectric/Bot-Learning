"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
// import {commands} from "../index";
module.exports = {
    name: "messageCreate",
    once: false,
    execute(commands, message) {
        const regex = new RegExp(/(\/|\/[a-z]|\/[A-Z]|r)*\s*([d|D])([\d])+/);
        const numreg = new RegExp(/([-+]?[0-9]*\.?[0-9]+[\/\+\-\*])+([-+]?[0-9]*\.?[0-9]+)/);
        const rollcom = commands.get("roll");
        const mathcom = commands.get("maths");
        if (message.author.bot)
            return;
        try {
            if (message.content.match(regex)) {
                if (rollcom) {
                    rollcom.execute(message);
                }
            }
            if (!message.content.match(regex) && message.content.match(numreg)) {
                if (mathcom) {
                    mathcom.execute(message);
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: "messagecreate",
                });
                return;
            }
        }
    },
};
