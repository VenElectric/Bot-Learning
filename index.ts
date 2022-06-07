import { BaseApplicationCommandData, BaseCommandInteraction, Message, SelectMenuInteraction } from "discord.js";
const fs = require("fs");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const { register_commands } = require("./deploy-commands");
import initiativeSocket from "./services/sockets/initiative";
import spellSocket from "./services/sockets/spells";
import loggingSocket from "./services/sockets/logging";
import rollSocket from "./services/sockets/roll";
import { commandDescriptions } from "./services/constants";
import { Socket } from "socket.io";
const weapon_of_logging = require("./utilities/LoggerConfig").logger;

require("dotenv").config();

const token = process.env.DISCORD_TOKEN;

export const io = require("socket.io")(server, {
  cors: {
    origin: process.env.HOST_URL,
    methods: ["GET", "POST"],
  },
});

app.use(
  require("cors")({
    origin: process.env.HOST_URL,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// Create a new client instance
export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file: any) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// ----- DISCORD ------
client.once("ready", async () => {
  weapon_of_logging.debug({ message: "ready" });
});

register_commands();
client.login(token);

let isBlocked = false;

process.on("unhandledRejection", (error) => {
  if (error instanceof Error) {
    if (!isBlocked) {
      client.channels.fetch(process.env.MY_DISCORD).then((channel: any) => {
        channel.send(`Unhandled Rejection ${error.message} `);
      });
      isBlocked = true;
      setTimeout(() => {
        isBlocked = false;
      }, 300000);
    } else {
      return;
    }
  }
});

io.on("connection", (socket: Socket) => {
  socket.on("create", function (room: any) {
    socket.join(room);
    weapon_of_logging.info({ message: "room joined", function: "create" });
  });
  initiativeSocket(socket, client, io);
  spellSocket(socket,client,io);
  rollSocket(socket,client,io);
  loggingSocket(socket);
});

client.on("messageCreate", async (message: Message) => {
  const regex = new RegExp(/(\/|\/[a-z]|\/[A-Z]|r)*\s*([d|D])([\d])+/);
  const numreg = new RegExp(
    /([-+]?[0-9]*\.?[0-9]+[\/\+\-\*])+([-+]?[0-9]*\.?[0-9]+)/
  );
  const rollcom = client.commands.get("roll");
  const mathcom = client.commands.get("maths");
  if (message.author.bot) return;
  try {
    if (message.content.match(regex)) {
      rollcom.execute(message);
    }
    if (!message.content.match(regex) && message.content.match(numreg)) {
      mathcom.execute(message);
    }
  } catch (error) {
    if (error instanceof Error) {
      weapon_of_logging.alert({
        message: error.message,
        function: "messagecreate",
      });
      return;
    }
  }
});

// Menu interactions
client.on("interactionCreate", async (interaction: SelectMenuInteraction) => {
  if (!interaction.isSelectMenu()) return;
  let sessionId = interaction.channel ? interaction.channel.id : "";
  try {
    if (interaction.customId === "helpmenu") {
      await interaction.deferUpdate();
      const helpEmbed = new MessageEmbed()
        .setTitle(interaction.values[0])
        .addField(
          "\u200b",
          commandDescriptions[`${interaction.values[0]}`].description,
          false
        )
        .setImage(commandDescriptions[`${interaction.values[0]}`].image);

      await interaction.editReply({
        embeds: [helpEmbed],
        components: [],
      });
    }
    if (interaction.customId === "changechannel") {
      let channelName = await interaction?.guild?.channels.fetch(
        interaction.values[0]
      );
      await interaction.deferUpdate();
      await interaction.editReply({
        content: `Your channel has been changed to ${channelName?.name}`,
        components: [],
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      weapon_of_logging.alert({
        message: error.message,
        function: "interactioncreate for menus",
      });
      return;
    }
  }
  // help menu
});

// Command Interactions
client.on("interactionCreate", async (interaction: BaseCommandInteraction) => {
  let sessionId = interaction.channel ? interaction.channel.id : "";
  if (!interaction.isCommand()) {
    return;
  }
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
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
});

server.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
