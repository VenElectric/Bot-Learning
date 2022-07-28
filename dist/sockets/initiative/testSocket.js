"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "testSocket",
    async execute(io, socket, data) {
        console.log(data);
        console.log("we are running!");
    },
};
