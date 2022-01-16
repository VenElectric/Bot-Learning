"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseD20 = exports.addBash = exports.parseRoll = void 0;
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const d20Regex = new RegExp(/([\d]*|[d|D]*)(\s?)([a-z]|[\d]+)/);
function parseRoll(msg) {
    let comment = "";
    let rollex = "";
    let length = msg.length;
    let prevtype = false;
    weapon_of_logging.debug("parseRoll", "entering parse roll", msg);
    for (let i = 0; i < length; i++) {
        // trying to match the d20 roll
        if (msg[i].match(/^\d*([d|D])([0-9])+/) && !prevtype) {
            weapon_of_logging.debug({ message: "match for ^\\d*([d|D])([0-9])+ regex", function: "parseRoll" });
            rollex += msg[i];
            continue;
        }
        // trying to match the d20 roll addition or subtraction
        if (msg[i].match(/[(]|[)]|[+|/|*|-]/) && !prevtype) {
            weapon_of_logging.debug({ message: "match for [(]|[)]|[+|/|*|-] regex", function: "parseRoll" });
            rollex += msg[i];
            continue;
        }
        // trying to match the d20 roll numbers
        if (msg[i].match(/[1-9]+/) && !prevtype) {
            weapon_of_logging.debug({ message: "match for number and not prevtype", function: "parseRoll" });
            rollex += msg[i];
            continue;
        }
        // matching the comments to parse into a new variable
        // Once we hit the comments, prevtype is true because we know there will be no more math or rolls afterwards.
        // not matching symbols because it's hitting the upper if statements first. Need a way to tell the function to stop after the d20 roll....
        if (typeof (msg[i]) == 'string' || prevtype) {
            weapon_of_logging.debug({ message: "match for string and prevtype", function: "parseRoll" });
            prevtype = true;
            comment += msg[i] + ' ';
        }
    }
    return { comment: comment, rollex: rollex };
}
exports.parseRoll = parseRoll;
function addBash(item, color) {
    let final = "";
    switch (color.toLowerCase()) {
        case "green":
            final = '```bash\n' + '"' + item + '"' + '```';
            break;
        case "blue":
            final = '```ini\n' + '[' + item + ']' + '```';
            break;
    }
    return final;
}
exports.addBash = addBash;
// try to parse out myriad d20 rolls from string
function parseD20(d20String) {
    let newD20 = d20String.match(d20Regex);
    console.log(newD20, "newd20");
}
exports.parseD20 = parseD20;
