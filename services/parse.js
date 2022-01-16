"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseD20 = exports.addBash = exports.parseRoll = void 0;
const LoggingClass_1 = require("../utilities/LoggingClass");
const d20Regex = new RegExp(/([\d]*|[d|D]*)(\s?)([a-z]|[\d]+)/);
function parseRoll(msg) {
    let comment = "";
    let rollex = "";
    let length = msg.length;
    let prevtype = false;
    LoggingClass_1.weapon_of_logging.DEBUG("parseRoll", "entering parse roll", msg);
    for (let i = 0; i < length; i++) {
        // trying to match the d20 roll
        if (msg[i].match(/^\d*([d|D])([0-9])+/) && !prevtype) {
            LoggingClass_1.weapon_of_logging.DEBUG("parseRoll", "match regex for d20", msg[i]);
            rollex += msg[i];
            continue;
        }
        // trying to match the d20 roll addition or subtraction
        if (msg[i].match(/[(]|[)]|[+|/|*|-]/) && !prevtype) {
            LoggingClass_1.weapon_of_logging.DEBUG("parseRoll", "match regex symbols", msg[i]);
            rollex += msg[i];
            continue;
        }
        // trying to match the d20 roll numbers
        if (msg[i].match(/[1-9]+/) && !prevtype) {
            LoggingClass_1.weapon_of_logging.DEBUG("parseRoll", "match regex for number", msg[i]);
            rollex += msg[i];
            continue;
        }
        // matching the comments to parse into a new variable
        // Once we hit the comments, prevtype is true because we know there will be no more math or rolls afterwards.
        // not matching symbols because it's hitting the upper if statements first. Need a way to tell the function to stop after the d20 roll....
        if (typeof (msg[i]) == 'string' || prevtype) {
            LoggingClass_1.weapon_of_logging.DEBUG("parseRoll", "match regex for prevtype. This isn't catching symbols", msg[i]);
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
