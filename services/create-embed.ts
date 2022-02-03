const { MessageEmbed } = require("discord.js");
const cemoj = ":bow_and_arrow:";
const bemoj = ":black_medium_square:";
import {
  InitiativeObject,
  RollStats,
  SpellObject,
  StatusEffect,
} from "../Interfaces/GameSessionTypes";
import { EmitTypes } from "../Interfaces/ServerCommunicationTypes";
import { escapeChar } from "./constants";

export function initiativeEmbed(embedArray: InitiativeObject[]) {
  let embed = new MessageEmbed();
  console.log(embedArray, "embedArray");
  for (let record of embedArray) {
    embed.addField(
      escapeChar,
      `${record.characterName}   |   ${record.isCurrent ? cemoj : bemoj}`,
      false
    );
  }
  embed.setTitle("Initiative List");

  return embed;
}

export function spellEmbed(embedArray: SpellObject[]) {
  let embed = new MessageEmbed();
  for (let record of embedArray) {
    embed.addField(record.effectName, record.effectDescription, false);
  }
  embed.setTitle("Spells/Effects List");

  return embed;
}

export function statusEmbed(character: string, statusArray: StatusEffect[]) {
  const embed = new MessageEmbed();
  embed.setTitle(`Current Turn: ${character}`);
  if (statusArray.length > 0) {
    for (let record of statusArray) {
      embed.addField(`Effects`, record.spellName);
    }
  }
  else {
	  embed.addField(`Effects`, "None");
  }

  return embed;
}

export async function rollEmbed(embedArray: RollStats[], tag: string) {
  let embedFields = [];
  let embed = new MessageEmbed();

  for (let record of embedArray) {
    embedFields.push({ name: record.name, value: record.roll, inline: false });
  }

  embed.setTitle(`Embeds for the tag: ${tag}`);
  embed.addFields([...embedFields]);

  return embed;
}
