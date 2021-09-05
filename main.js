/*
created by huda0209
Punish Keeper

main.js
 
ran by node.js
2021-9-5
*/
'use strict'

//node.js modules
const fs = require('fs');
const discord = require("discord.js");
require('date-utils');


//other 
const client = new discord.Client({ws: {intents: discord.Intents.ALL}});
const logger = require('./src/util/logFile');
const config = require('./src/util/config');

logger.info(`This service is standing now...`);
process.on("exit", ()=>{
	client.destroy();
    logger.info(`service end.`);
    logger.hasLastLog();
    console.log("Exitting...");
});
process.on("SIGINT", ()=>{
    process.exit(0);
});

//config
config.exist(true);
const BOT_DATA = config.loadConfig("setting.json");
let guildData = config.loadConfig("guildData.json");


//start the bot
client.on("ready", message => {
	logger.info(`bot is ready! ver. ${BOT_DATA.VERSION} \n        login: {cyan}${client.user.tag}{reset}\n`);
  	client.user.setActivity(`Your punishment is keeping! ver. ${BOT_DATA.VERSION}`, { type: 'PLAYING' });
});

client.on('guildMemberAdd', member => {
	for(const key in guildData.MuteRoles){
		if(!Object.hasOwnProperty.call(guildData.MuteUser, member.user.id)) return;
		const roles = guildData.MuteUser[member.user.id].map(key=>{
			if(!Object.hasOwnProperty.call(guildData.MuteRoles, key)) return;
			return guildData.MuteRoles[key];
		})
		
		roles.forEach(key=>{
			member.roles.add(key)
				.then(reslut=>{
					logger.info(`Succeed to give the role. UserID: {green}${member.user.id}{reset}, Role: {green}${key}`);
				})
				.catch(error=>{
					logger.error(`While add role, occurred error. Please check log. UserID: {green}${member.user.id}{reset}, Role: {green}${key}\n{reset}Error: ${error}`);
				})
		})
	}
})


client.on("guildMemberUpdate", async (olduser,newuser) =>{
	for(const key in guildData.MuteRoles){
		if(!olduser.roles.cache.get(guildData.MuteRoles[key]) && newuser.roles.cache.get(guildData.MuteRoles[key])){
			if(Object.hasOwnProperty.call(guildData.MuteUser, newuser.user.id)){
				if(guildData.MuteUser[newuser.user.id].indexOf(key)==-1) guildData.MuteUser[newuser.user.id].push(key);
			}else guildData.MuteUser[newuser.user.id] = [key];
			fs.writeFileSync("./config/guildData.json", JSON.stringify(guildData, null, '\t'), "utf8");
			logger.info(`Succeed to add the user in "MuteUser". UserID: {green}${newuser.user.id}{reset}, Role: {green}${key}`);
		}
		if(olduser.roles.cache.get(guildData.MuteRoles[key]) && !newuser.roles.cache.get(guildData.MuteRoles[key])){
			delete guildData.MuteUser[newuser.user.id][guildData.MuteUser[newuser.user.id].indexOf(key)];
            guildData.MuteUser[newuser.user.id] = guildData.MuteUser[newuser.user.id].filter(Boolean);
			fs.writeFileSync("./config/guildData.json", JSON.stringify(guildData, null, '\t'), "utf8");
			logger.info(`Succeed to remove the user in "MuteUser". UserID: {green}${newuser.user.id}{reset}, Role: {green}${key}`);
		}
	}
})


let token;
if(process.argv.length == 3){
  	switch(process.argv[2]){
  	  	case "main" :
  	    	token = BOT_DATA.MAIN_TOKEN;
  	    	break;
  	  	case "div" :
  	    	if(!BOT_DATA.DIV_TOKEN){
				logger.error(`Don't have a property "{red}DIV_TOKEN{reset}" in {green}setting.json{reset}.`);
				process.exit(0);
			}
  	    	token = BOT_DATA.DIV_TOKEN;
  	    	BOT_DATA.VERSION = `dev(${BOT_DATA.VERSION})`;
  	    	break;
  	  	default :
  	    	logger.error(`Unknown command. \nUsage \n {green}node main.js main{reset} : use main token \n {green}node main.js div{reset} : use divelopment token`);
  	    	process.exit(0);
  	};
}else if(process.argv.length == 2){
	token = BOT_DATA.MAIN_TOKEN;
}else{
	logger.error(`Unknown command. \nUsage \n {green}node main.js main{reset} : use main token \n {green}node main.js div{reset} : use divelopment token`);
	process.exit(0);
}
client.login(token)
	.then(res=>{
		logger.info(`Succeed to login the discord service.`);
	})
	.catch(error=>{
		logger.error(`Could not login the discord service.\n${error}`);
	});