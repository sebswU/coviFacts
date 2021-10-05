const discord = require('discord.js');
const client = new discord.Client();
const theWords = ['hoax','anti-vax','deep state','democrats','communists','all a ploy']
const infoList = ['https://www.cdc.gov/coronavirus/2019-ncov/index.html']
const listofsusppl = [];
const listofverysusppl = [];
const listofbadppl = [];

client.on('ready', () => {//all client. functions are arrow functions
    console.log("active now")
})

client.on('messageCreate', msg => {
  var greenArea;
  const usrOnNotice = async() => {//gets user that said/spammed a bad thing
    let susiBaka = message.guild.members.cache.get();
    return susiBaka;
  }
  const storeImp = async() => {//remembers the suspect in case he/she does it again
    let suspect = await usrOnNotice();

    
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
  }
  const secondChance = async() => {//removes any wrongdoing actions by bot
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
  }
  

  if (msg.author.bot) return//so that the bot does not react to itself

  if (theWords.some(theWords => msg.content.includes(theWords))) { 
    usrOnNotice();//detects *theWords(tm)*
    
    let discretionFlag = true;
    greenArea = setTimeout(discretionFlag = false, 30000);
    storeImp();
    
  }
  if (msg.content === '!discretion') {
    usrOnNotice();
    secondChance();
    clearTimeout(greenArea);
  }
  if (msg.content === "hi covifacts bot") {
      msg.reply('Hi! :) Any questions about Covid and the vaccines?')
  } else if (msg.content === 'bye covifacts bot'){
    msg.reply('Bye! Have a nice day!');
  }
})

client.login(process.env['TOKEN'])

