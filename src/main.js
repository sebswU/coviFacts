
'use strict';
const Sequelize = require('sequelize');
const fs = require('fs')
const { Client, Collection, Intents, Message, ReactionCollector } = require('discord.js');
const theWords = ['government ploy','deep state','population control experiment','coronavirus is fake','chinavirus','covid agenda', 'fake vaccine'];
const dotenv = require('dotenv');

const theInfo = ['https://www.cdc.gov/coronavirus/2019-ncov/index.html']
//this is the link that the bot sends as a message if it detects misinfo
dotenv.config();///stuff like the bot key (used to access the bot project) and the id for the server/bot stored in .env
const client = new Client({ 
    intents: [// the current version requires the intents of the bot (what it has access to) to be stated 
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ] 
});


client.commands = new Collection();
//discordjs command files, collection allows us to parse through the commands file
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	console.log(command);
	client.commands.set(command.data.name, command);
}
//discordjs EventEmitter class
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
//allows us to use external files and data from command files through 'require()'
//"Collection" => scripts in the file called "commands"

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
const Tags = sequelize.define('tags', {//each instance (row) in the database is called a Tag 
    name: {//user id
        type: Sequelize.STRING,
        unique: true,
    },

    description: Sequelize.TEXT,
    username: Sequelize.STRING,
    usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
});

client.once('ready', () => {
	Tags.sync();//database starts, saves***
    console.log('bot is up and running')
});
client.on('messageCreate', async msg =>{
    if (theWords.some(word => msg.content.includes(word))) {
		msg.reply(`${msg.author.username}, this is detected to be a malicious/disruptive comment. Please do not spread misinformation or spam content on the server. Here is information to educate:${theInfo[0]}`);
        const fugitiveName = msg.author.id;//user id is unique number combination belonging to specific acc
        const Username = msg.author.username;//username is the actual visible username

        const userKey = await Tags.findOne({where: {name: fugitiveName}})
        if (userKey) {
            if (userKey.usage_count >= 3) {
                console.log(`it is suggested that you permanently ban this user: ${userKey.username}`)
            }
            return userKey.increment('usage_count');
        } 
        try {
            // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
            const tag = await Tags.create({//creates a database and 
                name: fugitiveName,
                description: 'misinformation',
                username: Username,
                usage_count: 1,
            });

            return msg.reply(`Tag ${tag.name} added.`);
        } catch(error) {
            return msg.reply('something went wrong with adding tag')
        }
        //or display the miscellaneous error        }
	}
    if (msg.content.includes('!word')) {//command will send the message in the polling channel
        const arg = msg.content.slice(6).split(/ +/);//gets everything to the right of the !word command
        const wordEntered = arg.shift();
        const channel = client.channels.cache.get('953049903859396699')
        const poll = channel.send(`is ${wordEntered} a good candidate for determining misinformation?`)
        msg.reply('admin will look at word poll response and act accordingly')//admin will look and use the add feature to use
    }
})
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
    if (commandName === 'discretion') {
        const identityBuffer = await Tags.findOne({where: {name: interaction.user.username}});
        if (identityBuffer) {//checks to see if the user isn't trying to get out of trouble
            return interaction.reply("Sorry, but you cannot bail yourself out.")
        }
		const user = interaction.options.getString('username');//get from user input

        // takes the tag out of the system
        const rowCount = await Tags.destroy({ where: { username: user } });

        if (!rowCount) return interaction.reply('That tag did not exist.');
        console.log(`${tagName} has been wrongly convicted of spreading misinformation`)
        //show the changed list in the terminal
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.username).join(', ') || 'No tags set.';

        console.log(`List of usernames: ${tagString}`);
        return interaction.reply('Your request has been considered');//notifies user of slash command that it worked


	} 
    if (commandName === 'report') {
        const IDEntered = interaction.options.getString('userid');
        const usernameEntered = interaction.options.getString('username')
        const descriptOpt = interaction.options.getString('description')        
        const userKey = await Tags.findOne({where: {name: IDEntered}})
        if (userKey) {//increments count if already in database
            return userKey.increment('usage_count');
        } 
        try {
            const tag = await Tags.create({//add user into database if reported with id, name, and desc
                //creates a database with inputted values from slash command
                name: IDEntered,
                description: descriptOpt,
                username: usernameEntered,
                usage_count: 1,
            });
            //show if its actually in there by getting all values and printing it in terminal
            const tagList = await Tags.findAll({ attributes: ['name'] });
            const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
            console.log(`List of tags: ${tagString}`);

            return interaction.reply(`${msg.author.username}, this is detected to be a malicious/disruptive comment. Please do not spread misinformation or spam content on the server. Here is information to educate:${theInfo[0]}`);
        } catch(error) {
            return interaction.reply(`something went wrong with adding tag. Error: ${error}`)
        }
        
    }
    if (commandName === 'newword') {
       if (interaction.member?.permissions.has("ADMINISTRATOR")) {
            theWords.push(interaction.options.getString('addition'))
            return interaction.reply('word added')
       }
       return interaction.reply('you don\'t have the right permissions to do this')
    }
});

client.login(process.env.TOKEN);