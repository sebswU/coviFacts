/** 
* @param {require('../index.js')} client
*/

const discord = require('discord.js');

module.exports = async (client, message) => {
  if (msg.author.bot) return//so that the bot does not react to itself
  let susiBaka = await client.GetGuild(message.guild.id);//the suspect that has been accused
  
  
  return susiBaka;
}
