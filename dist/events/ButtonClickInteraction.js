"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const wait = require("node:timers/promises").setTimeout;
module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(commands, interaction) {
        if (!interaction.isButton())
            return;
        const messages = await interaction.channel.messages.fetch({ limit: 10 });
        console.log(messages);
        const btnMessage = interaction.channel.lastMessage;
        // remove this for testing and then try and see if we can locate the message. 
        // maybe place a key? Or look for the button ID????
        await btnMessage.edit({
            content: "A button was clicked!",
            components: [],
            embeds: []
        });
        // await btnMessage.interaction.deferUpdate();
        // await wait(4000);
        // await btnMessage.interaction.update({
        //   content: "A button was clicked!",
        //   components: [],
        // });
        await interaction.reply({ content: "Pong!" });
    },
};
