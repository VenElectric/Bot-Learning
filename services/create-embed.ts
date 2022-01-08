const { MessageEmbed } = require('discord.js');
const cemoj = ":bow_and_arrow:";
const bemoj = ":black_medium_square:";
import { IRoll } from "../Interfaces/IEmbed";
import { IInit } from "../Interfaces/IInit";
import { escapeChar } from "./constants";


export function createEmbed(embedArray:IInit[]) {
	let embed = new MessageEmbed();
	console.log(embedArray, "embedArray")
		for (let record of embedArray){
			console.log(record)
			embed.addField(escapeChar, `${record.characterName}   |   ${record.isCurrent? cemoj : bemoj}`, false)
		}
		embed.setTitle('Initiative List')
	
	return embed;
}

export async function rollEmbed(embedArray:IRoll[], tag:string){
	let embedFields = [];
	let embed = new MessageEmbed();

	for (let record of embedArray){
		embedFields.push({name: record.name,value: record.roll, inline:false })
	}

	embed.setTitle(`Embeds for the tag: ${tag}`)
	embed.addFields([...embedFields])

	return embed;
}