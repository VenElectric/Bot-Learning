import { weapon_of_logging } from "../utilities/LoggingClass";

const d20Regex = new RegExp(/([\d]*|[d|D]*)(\s?)([a-z]|[\d]+)/)
export function parseRoll(msg:string[]){
	let comment = ""
	let rollex = ""
	let length = msg.length;
	let prevtype = false 
	weapon_of_logging.DEBUG("parseRoll","entering parse roll",msg)
	for (let i = 0; i < length; i++){
        // trying to match the d20 roll
		if (msg[i].match(/^\d*([d|D])([0-9])+/) && !prevtype){
			weapon_of_logging.DEBUG("parseRoll","match regex for d20",msg[i])
			rollex += msg[i]
			continue
		}
        // trying to match the d20 roll addition or subtraction
		if (msg[i].match(/[(]|[)]|[+|/|*|-]/)  && !prevtype)
		{
			weapon_of_logging.DEBUG("parseRoll","match regex symbols",msg[i])
			rollex += msg[i]
			continue
		}
        // trying to match the d20 roll numbers
		if (msg[i].match(/[1-9]+/)  && !prevtype){
			weapon_of_logging.DEBUG("parseRoll","match regex for number",msg[i])
			rollex += msg[i]
			continue
		}
        // matching the comments to parse into a new variable
        // Once we hit the comments, prevtype is true because we know there will be no more math or rolls afterwards.

		// not matching symbols because it's hitting the upper if statements first. Need a way to tell the function to stop after the d20 roll....
		if(typeof(msg[i]) == 'string' || prevtype){
			weapon_of_logging.DEBUG("parseRoll","match regex for prevtype. This isn't catching symbols",msg[i])
			prevtype = true;
			comment += msg[i] + ' '
		}
		}
	return {comment:comment,rollex:rollex}
}

export function addBash(item: string, color:string){
	let final = "";
	switch (color.toLowerCase()){
		case "green":
			final = '```bash\n' + '"' + item + '"' + '```'
			break
		case "blue":
			final = '```ini\n' + '[' + item + ']' + '```'
			break
	}
	return final
}


// try to parse out myriad d20 rolls from string

export function parseD20(d20String: string){
	let newD20 = d20String.match(d20Regex)
	console.log(newD20, "newd20")
}