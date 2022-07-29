"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandDescriptions = exports.helpMenu = exports.ConsentCards = exports.escapeChar = exports.devWeb = exports.webComponent = void 0;
exports.webComponent = "www.dungeon-bot.app";
exports.devWeb = "localhost:8080";
exports.escapeChar = "\u200b";
// todo add in custom message for description
exports.ConsentCards = {
    GREEN: { name: "Green", value: "1FE774", description: "The player is OK with this conversation." },
    RED: { name: "Red", value: "DF3737", description: "The player is asking for the session to STOP." },
    YELLOW: { name: "Yellow", value: "FFFF00", description: "The player is asking to tread carefully or move on from this conversation and/or topic." },
    WHITE: { name: "White", value: "FFFFFF", description: "The player is asking for a turn to speak." },
    BLUE: { name: "Blue", value: "0056FF", description: "The player is asking for a snack/toilet/etc break." },
};
exports.helpMenu = [
    {
        label: "addchar",
        description: "Add a character",
        value: "addchar",
    },
    {
        label: "changechannel",
        description: "Change session channel",
        value: "changechannel",
    },
    {
        label: "clearsession",
        description: "Clear spells and initiative",
        value: "clearsession",
    },
    {
        label: "link",
        description: "Get the link to your session.",
        value: "link",
    },
    {
        label: "maths",
        description: "1+1 = 2",
        value: "maths",
    },
    {
        label: "previous",
        description: "Previous initiative",
        value: "previous",
    },
    {
        label: "next",
        description: "Next Initiative",
        value: "next",
    },
    {
        label: "resort",
        description: "Resort intiative",
        value: "resort",
    },
    {
        label: "roll",
        description: "Roll Dice: d20+3",
        value: "roll",
    },
    {
        label: "start",
        description: "Start initiative rounds.",
        value: "start",
    },
    {
        label: "collectrolls",
        description: "Collect rolls from players.",
        value: "collectrolls",
    },
];
exports.commandDescriptions = {
    addchar: {
        description: `This allows you to add your PC to the initiative list.
    All options are required. \n
    Name is the name of your character. \n
    Initiative is the result of the d20 roll with your initiative modifier added. \n 
    Initiative Modifier is the modifier on your character sheet used for your initiative. \n
    NPC marks whether the character you are adding is a PC (false) or an NPC (true) \n
    Nat 20 lets the bot know if you rolled a Nat 20 for your initiative roll. This adds 100 to your total so you are placed at the top of the initiative order.
    Click on the parameter 'Name', 'Initiative Modifier', 'Initiative', NPC, or Nat 20 to enter in that parameter and press the 'tab' button to confirm your submission.`,
        image: "https://media.giphy.com/media/Xokt7FPuu6fYrMVoIP/giphy.gif",
    },
    changechannel: {
        description: `Select a guild channel (from this guild only) from the drop-down list to change your session to.`,
        image: "",
    },
    collectrolls: {
        description: `__**Run Command**__ \nWhen you run this command, both a tag and the number of rolls to be collected is required.\n \n For instance, if you have three NPCs and two Player Characters that need to roll for initiative, you could type the following: 
    \n ***\u005C[collectrolls tag: init rollamount 5]*** \n This collects roll from 5 characters. \n 
    To enter the command and parameters, type in \u0005collectrolls and press enter. Then enter in the tag name and press the tab key. Then enter in the roll ammount (**numbers only!**) and hit tab again. Then press the enter key to submit.
    \n __**Collecting Rolls**__ \n Comment character names if you are rolling for multiple characters. \n \n Example: Tom has two characters: Gandalf the Wizard and his sidekick bard, Bilbo. \n
    Tom would roll twice using: \n \`\`\`ini\n[d20 init Bilbo]\`\`\` \n and then \n \`\`\`ini\n[d20 init Gandalf]\`\`\`
    The tag lets the bot know what rolls to collect. It is case sensitive!`,
        image: "",
    },
    clearsession: {
        description: `Remove all initiative records (names, initiative, modifiers) and spell effects. No turning back from this!`,
        image: "",
    },
    link: {
        description: `Get the link to your session's web page component.`,
        image: "",
    },
    maths: { description: `Do some basic math. 1+1 = ?`, image: "" },
    next: { description: `Move the initiative order forward.`, image: "" },
    previous: { description: `Move the initiative order back.`, image: "" },
    resort: {
        description: `Resort the initiative if you have added or removed characters. Use this if you don't want to reset whose turn in the initiative order it is.`,
        image: "",
    },
    start: {
        description: `Start rounds and sort initiative. Use this if you are just starting initiative or if you want to restart from the top of the initiative order.`,
        image: "",
    },
    "roll": {
        description: `Type any dXX (d10, d20, d4, d8, d100, etc. etc.) and roll the dice. No / necessary. You can add a comment after as well! Example: d20+5 To Hit`,
        image: "",
    },
};
