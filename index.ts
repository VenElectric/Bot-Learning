import { BaseCommandInteraction, Message } from "discord.js";

const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const express = require("express");
const { token } = require("./config.json");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
const { register_commands } = require("./deploy-commands")

app.use(
  require("cors")({
    origin: process.env.HOST_URL,
    methods: ["GET", "POST"],
  })
);

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
  console.log("Ready")
})

// Login to Discord with your client"s token
register_commands()
client.login(token);

client.on("messageCreate", async (message: Message) => {
  const regex = new RegExp(/^\d*([d|D])([0-9])+/);
  const numreg = new RegExp(/(^\d\*|\+|\-|\/\d)/);
  const prefix = new RegExp(/(\/r)/)
  const rollcom = client.commands.get("roll");
  const mathcom = client.commands.get("maths")
  if (message.content.match(regex) && message.content.match(numreg) || message.content.match(prefix)) {
    rollcom.execute(message)
  }
  if (!message.content.match(regex) && message.content.match(numreg)) {
    mathcom.execute(message)
    
  }
});

client.on("interactionCreate", async (interaction: BaseCommandInteraction) => {

  if (!interaction.isCommand()){ return }
  const command = client.commands.get(interaction.commandName);

  if (!command) { return }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// ----- ROUTES ------

app.get("/dungeon-bot/api/sessions/:id",async(req,res) =>{
  console.log('test')
  // get session list
})


server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
