const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const path = require("path");

require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;

async function register_commands() {
  const commands = [];
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: any) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

  switch (process.env.ENVIRONMENT) {
    case "DEVELOPMENT":
      await rest
        .put(Routes.applicationGuildCommands(clientId, guildID), {
          body: commands,
        })
        .then(() =>
          console.log("Successfully registered application commands.")
        )
        .catch(console.error);
      break;
    default:
      await rest
        .put(Routes.applicationCommands(clientId), { body: commands })
        .then(() =>
          console.log("Successfully registered application commands.")
        )
        .catch(console.error);
      break;
  }
}

module.exports = { register_commands };
