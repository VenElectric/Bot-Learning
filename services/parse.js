"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parse_args(msg) {
    let comment = "";
    let rollex = "";
    let length = msg.length;
    let prevtype = false;
    for (let i = 0; i < length; i++) {
        // trying to match the d20 roll
        if (msg[i].match(/^\d*([d|D])([0-9])+/) && !prevtype) {
            rollex += msg[i];
            continue;
        }
        // trying to match the d20 roll addition or subtraction
        if (msg[i].match(/[(]|[)]|[+|/|*|-]/) && !prevtype) {
            rollex += msg[i];
            continue;
        }
        // trying to match the d20 roll numbers
        if (msg[i].match(/[1-9]+/) && !prevtype) {
            rollex += msg[i];
            continue;
        }
        // matching the comments to parse into a new variable
        // Once we hit the comments, prevtype is true because we know there will be no more math or rolls afterwards.
        if (typeof (msg[i]) == 'string' || prevtype) {
            prevtype = true;
            comment += msg[i] + ' ';
        }
    }
    return { comment: comment, rollex: rollex };
}
exports.default = parse_args;
