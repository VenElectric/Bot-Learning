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
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const wait = require("node:timers/promises").setTimeout;
const chalk_1 = __importDefault(require("chalk"));
module.exports = {
    name: "interactionCreate",
    once: false,
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isButton())
                return;
            console.log(chalk_1.default.bgBlue("BUTTON BUTTON INTERACTION"), interaction);
            yield interaction.editReply({ content: 'A button was clicked!', components: [] });
            // const messages = await interaction.channel.messages.fetch().then((messages:any) => {
            //   messages.filter((message:any) => message.components[0].components.filter((component:any) => component.data.custom_id === 'primary' ))
            // })
            // console.log(messages)
            // .fetch().filter((message: any) => )
            // console.log(messages)
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
        });
    },
};
