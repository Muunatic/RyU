const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Client ping'),
    /**
     * @param {import("../../../client").interaction} interaction
     * @param {import("../../../client").client} client
     */
    async execute(interaction, client) {
        interaction.reply(`Pong !! \`${client.ws.ping}ms.\` Latensi \`${Date.now() - interaction.createdTimestamp}ms.\``);
    }
};
