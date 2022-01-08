import {
  BaseCommandInteraction,
  Message,
  SelectMenuInteraction,
} from "discord.js";

const fs = require("fs");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const express = require("express");
const { token } = require("./config.json");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
const { register_commands } = require("./deploy-commands");
import {
  commandDescriptions,
  initiativeCollection,
  spellCollection,
} from "./services/constants";
import { retrieveCollection, getSession } from "./services/database-common";
import { finalizeInitiative } from "./services/initiative";
import {IInit} from "./Interfaces/IInit";
import {EmitTypes} from "./services/emitTypes";

require("dotenv").config();

const io = require("socket.io")(server, {
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

console.log(process.env.HOST_URL);
app.use(express.json());

// Create a new client instance
const client = new Client({
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
// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready");
});

// Login to Discord with your client"s token
register_commands();
client.login(token);

io.on("connection", (socket: any) => {
  socket.on("create", function (room: any) {
    socket.join(room);
    console.log(room);
  });

  socket.on("test", function (data: any) {
    console.log("data", data);
  });

  socket.on("getinitial", async (sessionId: any, respond: any) => {
    let initiativeList = await retrieveCollection(sessionId, initiativeCollection);
    let spellList = await retrieveCollection(sessionId, spellCollection);
    let [isSorted, onDeck, sessionSize] = await getSession(sessionId)

    respond({
      initiativeList: initiativeList,
      spellList: spellList,
      isSorted: isSorted,
      onDeck: onDeck,
      sessionId,
    });
  });


  socket.on(EmitTypes.ROUND_START, async (sessionId:any, respond:any) => {
    let initiativeList = await retrieveCollection(sessionId, initiativeCollection);
    let [isSorted, onDeck, sessionSize] = await getSession(sessionId)
    let sortedList = await finalizeInitiative(initiativeList as IInit[], true,sessionId,onDeck,isSorted)
    socket.broadcast.to(sessionId).emit(EmitTypes.ROUND_START,{initiativeList: sortedList, isSorted: isSorted, sessionSize:sessionSize, onDeck:onDeck});
    respond({initiativeList: sortedList, isSorted: isSorted, sessionSize:sessionSize, onDeck:onDeck})
  })

  socket.on("addinit", (sessionId:any, respond:any) => {

    respond("test")
  })
});

client.on("error", (error: unknown) => {
  if (error instanceof Error) {
    console.log(error);
    console.log("client.on");
  }
});

client.on("messageCreate", async (message: Message) => {
  const regex = new RegExp(/(\/|\/[a-z]|\/[A-Z]|r)*\s*([d|D])([\d])+/);
  const numreg = new RegExp(/(^\d\s*(\*|\+|\-|\/|=)\s*(\d|[a-z]))/);
  // const prefix = new RegExp(/\/[a-z]|\/|[r|R]/);
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
      message.channel.send(error.message);
    }
  }
});

// Menu interactions
client.on("interactionCreate", async (interaction: SelectMenuInteraction) => {
  if (!interaction.isSelectMenu()) return;

  // help menu
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
});

// Command Interactions
client.on("interactionCreate", async (interaction: BaseCommandInteraction) => {
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
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
    });
  }
});



server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
