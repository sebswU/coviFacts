/** 
* @param {require('../index.js')} client
*/

const discord = require('discord.js');

module.exports = {
  name: 'suspicion',
  async execute(client, message) {
    let susiBaka = await client.GetGuild(message.guild.id);//the suspect that has been accused
  
    console.log('menace to society id to ban:')
    console.log(susiBaka);
  }
}
  
