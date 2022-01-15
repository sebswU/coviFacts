/** 
* @param {require('../index.js')} client
*/
require('@tensorflow-models/tfjs');
const discord = require('discord.js');
const model = require('@tensorflow-models/toxicity');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');
const listofsusppl = [];
const listofverysusppl = [];
const listofbadppl = [];
let baddie = false;
const theWords = ['hoax','anti-vax','deep state','democrats','communists','all a ploy']
const infoList = ['https://www.cdc.gov/coronavirus/2019-ncov/index.html']

// The minimum prediction confidence.
const threshold = 0.9;

// Load the model. Users optionally pass in a threshold and an array of
// labels to include.
toxicity.load(threshold).then(model => {
  const sentences = msg.content;//takes in discord texts as input

  model.classify(sentences).then(predictions => {
    // `predictions` is an array of objects, one for each prediction head,
    // that contains the raw probabilities for each input along with the
    // final prediction in `match` (either `true` or `false`).
    // If neither prediction exceeds the threshold, `match` is `null`.
    if (match !== null) {
      baddie = true;
    }
  });
});
//make comment here, is supposed to be for 
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

let suspect;
client.on('messageCreate', msg => {
  var greenArea;
  const usrOnNotice = async() => {//gets user that said/spammed a bad thing
    let susiBaka = message.guild.members.cache.get();
    return susiBaka;
  }
  const storeImp = async() => {//remembers the suspect in case he/she does it again
    try {
        suspect = await usrOnNotice();
      if (listofsusppl.includes(suspect)) {//strike 2
        listofsusppl.pop(suspect);
        listofverysusppl.push(suspect);
        message.reply("this is a warning. You have been put on notice. Other members can type in !discretion within 30 seconds in order to take matters into other consideration.");

      } else if (listofverysusppl.includes(suspect)) {//strike 3 (kicks user out)
        listofverysusppl.pop(suspect);
        listofbadppl.push(suspect);
        suspect.kick();
      } else { // strike 1
        listofsusppl.push(suspect);
        msg.reply('your recent post may contain misinformation, which violates Discord platform policies. Please refrain from further discussion on the current subject. Inaccountability to cooperate otherwise may result in indefinite suspension. For any questions regarding the coronavirus and the vaccines pertaining to it, please visit:\n'+`${infoList[0]}`);
      }
    } catch(e) {
      console.log(e);
    }

  }
  const secondChance = async() => {//removes any wrongdoing actions by bot
    try {
      let suggestor = await usrOnNotice();
      if (suggestor !== suspect && discretionFlag === true) {
        if (listofsusppl.includes(suspect)) {//if innocent got strike 2
          listofsusppl.pop(suspect);
        } else if (listofverysusppl.includes(suspect)) {//strike 3 innocent
          listofverysusppl.pop(suspect);
        } 
        listofsusppl.pop(suspect);
        clearTimeout(greenArea);
        msg.reply("Thank you for informing about a misunderstanding.");
      } else {
        msg.reply("you cannot bail yourself out");
    }
      
      } catch(error) {
        console.log(error);
      }
  }
  

  if (msg.author.bot) return//so that the bot does not react to itself

  if (sussy === true) { 
    usrOnNotice();//detects *theWords(tm)*
    
    let discretionFlag = true;
    setTimeout(discretionFlag = false, 30000);
    storeImp();
    
  }
  if (msg.content === '!discretion') {
    usrOnNotice();
    secondChance();
    clearTimeout();
  }

  if (msg.content === "hi covifacts bot") {
    msg.reply('Hi! :) Any questions about Covid and the vaccines?')
  } else if (msg.content === 'bye covifacts bot'){
    msg.reply('Bye! Have a nice day!');
  }
})