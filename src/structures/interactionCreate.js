const { client } = require('../../client');

client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;
    if (!interaction.guild) return;

    const command = client.commands.get(interaction.commandName);
    
    if (!command) return;
    
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: process.env.DEFAULT_ERROR, ephemeral: true });
    }

});