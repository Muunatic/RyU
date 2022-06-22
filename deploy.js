const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId } = require('./src/data/config.json');

const commands = []

.map(command => command.toJSON());

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log('Refreshing...');
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Deployed!');
	} catch (error) {
		console.error(error);
	}
})();
