const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId } = require('./src/data/config.json');

const commands = [
  new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play music')
  .addStringOption(option =>
    option.setName('args')
    .setDescription('Give args to playing music')
    .setRequired(true)
  ),

  new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop music'),

  new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip music'),

  new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Queue music'),

  new SlashCommandBuilder()
  .setName('pause')
  .setDescription('Pause music'),

  new SlashCommandBuilder()
  .setName('resume')
  .setDescription('Resume music'),

  new SlashCommandBuilder()
  .setName('repeat')
  .setDescription('Repeat music'),
  
  new SlashCommandBuilder()
  .setName('nowplaying')
  .setDescription('What\'s music playing now?'),

  new SlashCommandBuilder()
  .setName('volume')
  .setDescription('Volume adjustment')
  .addNumberOption(option =>
    option.setName('number')
    .setDescription('Give number value to change volume')
    .setRequired(true)
  ),

  new SlashCommandBuilder()
  .setName('lock')
  .setDescription('Lock voice channel'),

  new SlashCommandBuilder()
  .setName('unlock')
  .setDescription('Unlock voice channel'),

  new SlashCommandBuilder()
  .setName('bitrate')
  .setDescription('Bitrate voice channel')
  .addNumberOption(option =>
    option.setName('number')
    .setDescription('Give number value to change bitrate')
    .setRequired(true)
  ),

  new SlashCommandBuilder()
  .setName('help')
  .setDescription('Help command'),
  
  new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Client ping'),
  
  new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('User info'),

  new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Server info'),
  
  new SlashCommandBuilder()
  .setName('avatar')
  .setDescription('Get Avatar')
  .addUserOption(option =>
    option.setName('user')
    .setDescription('Mention user')
  ),

  new SlashCommandBuilder()
  .setName('genshin')
  .setDescription('Genshin impact')
  .addStringOption(characters =>
    characters.setName('characters')
    .setDescription('Characters')
  )
  .addStringOption(weapon =>
    weapon.setName('weapon')
    .setDescription('Weapon')
  ),

  new SlashCommandBuilder()
  .setName('afk')
  .setDescription('Set AFK'),

  new SlashCommandBuilder()
  .setName('mal')
  .setDescription('MAL scraper')
  .addStringOption(option =>
    option.setName('anime')
    .setDescription('Anime name')
    .setRequired(true)
  ),

  new SlashCommandBuilder()
  .setName('osu')
  .setDescription('OSU profile')
  .addStringOption(option =>
    option.setName('username')
    .setDescription('OSU username')
    .setRequired(true)
  )
  .addStringOption(option2 =>
    option2.setName('mode')
    .setDescription('1 (osu) 2 (taiko) 3 (osumania)')
    .setRequired(true)
  ),

  new SlashCommandBuilder()
  .setName('activities')
  .setDescription('Start activities')
  .addStringOption(option => 
    option.setName('value')
    .setDescription('Activities value')
    .setRequired(true)
    .addChoices(
      {name: 'Youtube Together', value: '880218394199220334'},
      {name: 'Fishington', value: '814288819477020702'},
      {name: 'Chess In The Park', value: '832012774040141894'},
      {name: 'Betrayal', value: '773336526917861400'},
      {name: 'Poker In The Night', value: '755827207812677713'},
      {name: 'Word Snacks', value: '879863976006127627'},
      {name: 'Letter League', value: '879863686565621790'},
    )
  ),

  new SlashCommandBuilder()
  .setName('filter')
  .setDescription('Audio filter')
  .addStringOption(option => 
    option.setName('filter')
    .setDescription('Choose audio filter')
    .setRequired(true)
    .addChoices(
      {name: 'Bassboost', value: 'bassboost'},
      {name: 'Karaoke', value: 'karaoke'},
      {name: 'Nightcore', value: 'nightcore'},
      {name: '8D', value: '8D'},
      {name: 'Earrape', value: 'earrape'},
    )
  ),

  new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Client stats'),

  new SlashCommandBuilder()
  .setName('weather')
  .setDescription('Weather info')
  .addStringOption(option =>
    option.setName('city')
    .setDescription('City value')
    .setRequired(true)
  ),

]

.map(command => command.toJSON());

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log('Deploying');
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Deployed!');
	} catch (error) {
		console.error(error);
	}
})();
