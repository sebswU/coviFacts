const discord = require('discord.js');
const client = new discord.Client();
const theWords = ['hoax','anti-vax','deep state','democrats','communists','all a ploy']
const infoList = ['https://www.cdc.gov/coronavirus/2019-ncov/index.html']
const listofsusppl = []
const listofverysusppl = []
const listofbadppl = []

client.on('ready', () => {//all client. functions are arrow functions
    console.log("ready to disprove liars or smtg idk")
})

client.on('message', msg => {
  if (msg.author.bot) return

  if (theWords.some(theWords => msg.content.includes(theWords))) {
    const usrOnNotice = async name => msg.author.fetch(username);
    listofsusppl.push(usrOnNotice);
    msg.reply('your recent post may contain misinformation, which violates Discord platform policies. Please refrain from further discussion on the current subject. Inaccountability to cooperate otherwise may result in indefinite suspension. For any questions regarding the coronavirus and the vaccines pertaining to it, please visit:\n'+`${infoList[0]}`);
    if (msg.content === "!discretion" && msg.author.username !== usrOnNotice) {
      listofsusppl.pop(usrOnNotice);
      msg.reply("Thank you for informing about a misunderstanding.")
    }
  }
  if (tally == 2){

    message.channel.send("This is a warning. You have been put on notice. Other members can type in !discretion in order to take matters into other consideration.")
    
  }
  if (tally == 3) {
    discord.kick();
  }
    if (msg.content === "hi covifacts bot") {
        msg.reply('Hi! :) Any questions about Covid and the vaccines?')
    } else if (msg.content === 'bye covifacts bot'){
      msg.reply('Bye! Have a nice day!')
    }
})

const mySecret = process.env['TOKEN']
client.login(mySecret)

