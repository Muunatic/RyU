const { SlashCommandBuilder } = require('@discordjs/builders');
const { client } = require('../../../../client');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Client ping'),
    async execute(interaction) {
        interaction.reply(`Pong !! \`${client.ws.ping}ms.\` Latensi \`${Date.now() - interaction.createdTimestamp}ms.\``);
    },
};