"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(commands, interaction) {
        if (!interaction.isCommand()) {
            return;
        }
        const command = commands.get(interaction.commandName);
        if (!command) {
            return;
        }
        try {
            await command.execute(interaction);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
                weapon_of_logging.warning({
                    message: error.message,
                    function: "interactioncreate for slash commands",
                });
            }
            await interaction.reply({
                content: "There was an error while executing this command!",
            });
        }
    },
};
