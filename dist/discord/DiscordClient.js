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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const BaseClass_1 = __importDefault(require("../utilities/BaseClass"));
const constants_1 = require("../services/constants");
const constants_2 = require("../discord/constants");
const { register_commands } = require("../deploy-commands");
const { GatewayIntentBits, Partials } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
class DungeonDiscordClient extends BaseClass_1.default {
    constructor(sonic) {
        super(sonic);
        this.client = new discord_js_1.Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
            partials: [Partials.Channel],
        });
        this.commands = new discord_js_1.Collection();
        this.cemoj = ":bow_and_arrow:";
        this.bemoj = ":black_medium_square:";
        this.menuCollection = new discord_js_1.Collection();
    }
    init() {
        this.client.login(token);
        this.initCommands();
        this.initEvents();
        this.initMenuCollection();
    }
    initCommands() {
        const commandsPath = path.join(__dirname, "../", "commands");
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            this.commands.set(command.data.name, command);
        }
        register_commands();
    }
    initEvents() {
        const eventsPath = path.join(__dirname, "../", "events");
        const eventFiles = fs
            .readdirSync(eventsPath)
            .filter((file) => file.endsWith(".js"));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                this.client.once(event.name, (...args) => __awaiter(this, void 0, void 0, function* () {
                    this.log("Discord event executing", this.debug, event.name);
                    event.execute(this.commands, this.sonic, ...args);
                }));
            }
            else {
                this.client.on(event.name, (...args) => __awaiter(this, void 0, void 0, function* () {
                    this.log("Event Executing", this.debug, event.name);
                    event.execute(this.commands, this.sonic, ...args);
                }));
            }
        }
    }
    getClient() {
        return this.client;
    }
    getCommands() {
        return this.commands;
    }
    baseEmbed(title) {
        return new discord_js_1.EmbedBuilder().setTitle(title);
    }
    initiativeEmbed(embedArray) {
        // todo logging
        let embed = this.baseEmbed("Initiative List");
        for (let record of embedArray) {
            embed.addFields({
                name: constants_1.escapeChar,
                value: `${record.characterName} | ${record.isCurrent ? this.cemoj : this.bemoj}`,
                inline: false,
            });
        }
        return embed;
    }
    spellEmbed(embedArray) {
        let embed = this.baseEmbed("Spells/Effects List");
        for (let record of embedArray) {
            embed.addFields({
                name: record.effectName,
                value: record.effectDescription,
                inline: false,
            });
        }
        return embed;
    }
    statusEmbed(character, statusArray) {
        // too much spacing?
        const embed = this.baseEmbed("Status Effects");
        embed.setTitle(`Current Turn: ${character}`);
        if (statusArray.length > 0) {
            embed.addFields({
                name: `Effects`,
                value: constants_1.escapeChar,
                inline: false,
            });
            for (let record of statusArray) {
                embed.addFields({
                    name: constants_1.escapeChar,
                    value: record.spellName,
                    inline: false,
                });
            }
        }
        else {
            embed.addFields({ name: `Effects`, value: "None", inline: false });
        }
        return embed;
    }
    rollEmbed(embedArray, tag) {
        let embedFields = [];
        const embed = this.baseEmbed(`Embeds for the tag: ${tag}`);
        for (let record of embedArray) {
            embedFields.push({
                name: record.name,
                value: record.roll,
                inline: false,
            });
        }
        embed.addFields([...embedFields]);
        return embed;
    }
    diceLogEmbed(embedArray, limit) {
        const embed = this.baseEmbed("Recent Dice Logs");
        for (let x = 0; x < limit; x++) {
            const log = JSON.parse(embedArray[x]);
            const fieldString = `Roll: ${log.roll.output} \n Comment: ${log.comment}`;
            embed.addFields({ name: log.name, value: fieldString, inline: false });
        }
        return embed;
    }
    consentCardEmbed(color, userName) {
        const file = new discord_js_1.AttachmentBuilder(`./dist/images/${color.value}.png`).setDescription(color.name);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`${color.name} being flagged by ${userName}`)
            .setColor(`#${color.value}`)
            .setDescription(color.description)
            .setImage(`attachment://${color.value}.png`)
            .setTimestamp();
        return { embed: embed, file: file };
    }
    createHelpMenuObject() {
        let helpMenu = [];
        for (const record of this.commands) {
            if (record[1].data.name === "echo")
                continue;
            helpMenu.push({
                label: record[1].data.name,
                description: record[1].data.description,
                value: record[1].data.name,
            });
        }
        return helpMenu;
    }
    createSelectMenu(menuItems, customId, placeholder) {
        const menu = new discord_js_1.SelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(placeholder)
            .addOptions(menuItems);
        return menu;
    }
    createActionRow(rowComponent) {
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents(rowComponent);
        return actionRow;
    }
    initMenuCollection() {
        this.menuCollection.set(constants_2.menuTypes.HELP, this.createHelpMenuObject());
    }
    retrieveMenu(type) {
        // keyof menuTypes???? lookup typescript stuff
        return this.menuCollection.get(type);
    }
}
exports.default = DungeonDiscordClient;
