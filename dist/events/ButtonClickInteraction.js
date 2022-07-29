"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const wait = require("node:timers/promises").setTimeout;
const chalk_1 = __importDefault(require("chalk"));
module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(commands, interaction) {
        if (!interaction.isButton())
            return;
        console.log(chalk_1.default.bgBlue("BUTTON BUTTON INTERACTION"), interaction);
        await interaction.editReply({ content: 'A button was clicked!', components: [] });
        // const messages = await interaction.channel.messages.fetch().then((messages:any) => {
        //   messages.filter((message:any) => message.components[0].components.filter((component:any) => component.data.custom_id === 'primary' ))
        // })
        // console.log(messages)
        // .fetch().filter((message: any) => )
        // console.log(messages)
        const btnMessage = interaction.channel.lastMessage;
        console.log(Object.keys(btnMessage));
        console.log(btnMessage);
        // remove this for testing and then try and see if we can locate the message. 
        // maybe place a key? Or look for the button ID????
        // await btnMessage.edit({
        //   content: "A button was clicked!",
        //   components: [],
        //   embeds: []
        // });
        // await btnMessage.interaction.deferUpdate();
        // await wait(4000);
        // await btnMessage.interaction.update({
        //   content: "A button was clicked!",
        //   components: [],
        // });
        // await interaction.reply({ content: "Pong!" });
    },
};
