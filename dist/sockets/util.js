"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelSend = void 0;
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
function channelSend(client, item, sessionId) {
    client.channels.fetch(sessionId).then((channel) => {
        channel.send(item);
        weapon_of_logging.info({
            message: "sending initiative to discord channel success",
            function: "DISCORD SOCKET_RECEIVER",
        });
    });
}
exports.channelSend = channelSend;
function testWrap(fn) {
    fn.prototype.fName = fn.name;
    console.log(fn.prototype.fName);
    return (...args) => {
        console.log(...args);
        fn(...args);
    };
}
function insideFunction(...args) {
    console.log(insideFunction.prototype.fName);
    console.log(args);
}
const testFunc = testWrap(insideFunction);
testFunc("my test");
