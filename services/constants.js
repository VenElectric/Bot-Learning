"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandDescriptions = exports.helpMenu = exports.escapeChar = exports.devWeb = exports.webComponent = exports.initiativeCollection = exports.spellCollection = void 0;
exports.spellCollection = "spells";
exports.initiativeCollection = "initiative";
exports.webComponent = "www.dungeon-bot.app";
exports.devWeb = "localhost:8080";
exports.escapeChar = "\u200b";
exports.helpMenu = [
    {
        label: "addchar",
        description: "",
        value: "addchar"
    },
    {
        label: "changechannel",
        description: "",
        value: "changechannel"
    },
    {
        label: "clearsession",
        description: "",
        value: "clearsession"
    },
    {
        label: "link",
        description: "",
        value: "link"
    },
    {
        label: "maths",
        description: "",
        value: "maths"
    },
    {
        label: "previous",
        description: "",
        value: "previous"
    },
    {
        label: "next",
        description: "",
        value: "next"
    },
    {
        label: "resort",
        description: "",
        value: "resort"
    },
    {
        label: "dice roll",
        description: "",
        value: "dice roll"
    },
    {
        label: "start",
        description: "",
        value: "start"
    },
    {
        label: "collectrolls",
        description: "",
        value: "collectrolls"
    }
];
exports.commandDescriptions = {
    "addchar": { description: `This allows you to add your PC to the initiative list.
    All options are required. \n
    Name is the name of your character. \n
    Initiative is the result of the d20 roll with your initiative modifier added. \n 
    Initiative Modifier is the modifier on your character sheet used for your initiative. \n
    NPC marks whether the character you are adding is a PC (false) or an NPC (true) \n
    Nat 20 lets the bot know if you rolled a Nat 20 for your initiative roll. This adds 100 to your total so you are placed at the top of the initiative order.
    Click on the parameter 'Name', 'Initiative Modifier', 'Initiative', NPC, or Nat 20 to enter in that parameter and press the 'tab' button to confirm your submission.`, image: "https://media.giphy.com/media/Xokt7FPuu6fYrMVoIP/giphy.gif" },
    "changechannel": { description: `Select a guild channel (from this guild only) from the drop-down list to change your session to.`, image: "" },
    "collectrolls": { description: `__**Run Command**__ \nWhen you run this command, both a tag and the number of rolls to be collected is required.\n \n For instance, if you have three NPCs and two Player Characters that need to roll for initiative, you could type the following: 
    \n ***\u005C[collectrolls tag: init rollamount 5]*** \n This collects roll from 5 characters. \n 
    To enter the command and parameters, type in \u0005collectrolls and press enter. Then enter in the tag name and press the tab key. Then enter in the roll ammount (**numbers only!**) and hit tab again. Then press the enter key to submit.
    \n __**Collecting Rolls**__ \n Comment character names if you are rolling for multiple characters. \n \n Example: Tom has two characters: Gandalf the Wizard and his sidekick bard, Bilbo. \n
    Tom would roll twice using: \n \`\`\`ini\n[d20 init Bilbo]\`\`\` \n and then \n \`\`\`ini\n[d20 init Gandalf]\`\`\`
    The tag lets the bot know what rolls to collect. It is case sensitive!`, image: "" },
    "clearsession": { description: `Remove all initiative records (names, initiative, modifiers) and spell effects. No turning back from this!`, image: "" },
    "link": { description: `Get the link to your session's web page component.`, image: "" },
    "maths": { description: `Do some basic math. 1+1 = ?`, image: "" },
    "next": { description: `Move the initiative order forward.`, image: "" },
    "previous": { description: `Move the initiative order back.`, image: "" },
    "resort": { description: `Resort the initiative if you have added or removed characters. Use this if you don't want to reset whose turn in the initiative order it is.`, image: "" },
    "start": { description: `Start rounds and sort initiative. Use this if you are just starting initiative or if you want to restart from the top of the initiative order.`, image: "" },
    "dice roll": { description: `Type any dXX (d10, d20, d4, d8, d100, etc. etc.) and roll the dice. No / necessary. You can add a comment after as well! Example: d20+5 To Hit`, image: "" },
};
