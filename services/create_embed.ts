const { MessageEmbed } = require('discord.js');
const cemoj = ":bow_and_arrow:";
const bemoj = ":black_medium_square:";

function embed_set(embedarray:any[]) {
	let embed_fields = []
	let embed = new MessageEmbed();

		for (let x in embedarray){
			
			embed_fields.push({ name: `${embedarray[x].name}`, value: `${embedarray[x].cmark ? cemoj:bemoj}`, inline: false})
		}
		embed.setTitle('Initiative List')
		embed.addFields([...embed_fields])
	
	return embed;
}