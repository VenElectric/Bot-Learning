const { MessageEmbed } = require('discord.js');
const cemoj = ":bow_and_arrow:";
const bemoj = ":black_medium_square:";
import { InitiativeObject, RollStats, SpellObject } from "../Interfaces/GameSessionTypes";
import { escapeChar } from "./constants";



export function initiativeEmbed(embedArray:InitiativeObject[]) {
	let embed = new MessageEmbed();
	console.log(embedArray, "embedArray")
		for (let record of embedArray){
			embed.addField(escapeChar, `${record.characterName}   |   ${record.isCurrent? cemoj : bemoj}`, false)
		}
		embed.setTitle('Initiative List')
	
	return embed;
}

export function spellEmbed(embedArray: SpellObject[]){
	let embed = new MessageEmbed();
	console.log(embedArray, "embedArray")
		for (let record of embedArray){
			embed.addField(record.spellName, record.effect, false)
		}
		embed.setTitle('Initiative List')
	
	return embed;
}

export async function rollEmbed(embedArray:RollStats[], tag:string){
	let embedFields = [];
	let embed = new MessageEmbed();

	for (let record of embedArray){
		embedFields.push({name: record.name,value: record.roll, inline:false })
	}

	embed.setTitle(`Embeds for the tag: ${tag}`)
	embed.addFields([...embedFields])

	return embed;
}