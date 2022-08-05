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
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("discord.js");
const { v4: uuidv4 } = require("uuid");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addchar")
        .setDescription("Enter your initiative.")
        .addStringOption((option) => option
        .setName("charactername")
        .setDescription("Enter Character Name")
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("initiativeroll")
        .setDescription("Enter Initiative Dice Roll (NO MODIFIER ADDED)")
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("initiativemodifier")
        .setDescription("Enter Initiative Modifier")
        .setRequired(true))
        .addBooleanOption((option) => option
        .setName("isnpc")
        .setDescription("NPC? True or False")
        .setRequired(true))
        .addBooleanOption((option) => option
        .setName("isnat20")
        .setDescription("Rolled a Nat 20?")
        .setRequired(true)),
    description: `This allows you to add your PC to the initiative list.
  All options are required. \n
  Name is the name of your character. \n
  Initiative is the result of the d20 roll with your initiative modifier added. \n 
  Initiative Modifier is the modifier on your character sheet used for your initiative. \n
  NPC marks whether the character you are adding is a PC (false) or an NPC (true) \n
  Nat 20 lets the bot know if you rolled a Nat 20 for your initiative roll. This adds 100 to your total so you are placed at the top of the initiative order. \n
  Click on the parameter 'Name', 'Initiative Modifier', 'Initiative', NPC, or Nat 20 to enter in that parameter and press the 'tab' button to confirm your submission.`,
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.channel == null)
                return;
            const sessionId = interaction.channel.id;
            const commandName = interaction.commandName;
            const name = interaction.options.getString("charactername");
            let initiativeRoll = interaction.options.getInteger("initiativeroll");
            const initiativeModifier = interaction.options.getInteger("initiativemodifier");
            const isNpc = interaction.options.getBoolean("isnpc");
            const isNat20 = interaction.options.getBoolean("isnat20");
            if (isNat20) {
                initiativeRoll += 100;
            }
            const options = {
                id: uuidv4(),
                characterName: name,
                initiative: initiativeRoll,
                initiativeModifier: initiativeModifier,
                roundOrder: 0,
                isCurrent: false,
                statusEffects: [],
                isNpc: isNpc,
            };
            try {
                sonic.emit("getInit", (init) => __awaiter(this, void 0, void 0, function* () {
                    sonic.log("Adding character to database", sonic.info, commandName, options);
                    yield init.addDoc(options, sessionId);
                    sonic.emit("getIO", (ioC) => __awaiter(this, void 0, void 0, function* () {
                        ioC.io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE, { payload: options, sessionId: sessionId });
                        ioC.io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.RESET_ONDECK, true);
                        sonic.log("Emits fired", sonic.info, commandName);
                        const replyString = `Your character, ${name}, has been added with an initiative of ${initiativeRoll}. You can edit this on the website component using the /link command. \n Any rolled nat 20's have 100 added on for sorting purposes.`;
                        yield interaction.reply(replyString);
                    }));
                }));
            }
            catch (error) {
                sonic.onError(error, commandName, options);
            }
        });
    },
};
