"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveMenu = exports.initCollection = exports.createHelpMenu = exports.MenuType = void 0;
const { Collection } = require("discord.js");
const menuCollection = new Collection();
var MenuType;
(function (MenuType) {
    MenuType["HELP_MENU"] = "HELP_MENU";
})(MenuType = exports.MenuType || (exports.MenuType = {}));
function createHelpMenu(commands) {
    let helpMenu = [];
    for (const record of commands) {
        if (record[1].data.name === "echo")
            continue;
        helpMenu.push({ label: record[1].data.name, description: record[1].data.description, value: record[1].data.name });
    }
    return helpMenu;
}
exports.createHelpMenu = createHelpMenu;
function initCollection(commands) {
    menuCollection.set(MenuType.HELP_MENU, createHelpMenu(commands));
}
exports.initCollection = initCollection;
function retrieveMenu(type) {
    return menuCollection.get(type);
}
exports.retrieveMenu = retrieveMenu;
