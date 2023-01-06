const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock voice channel'),
    async execute(interaction) {
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        let everyone = interaction.member.guild.roles.cache.get(process.env.EVERYONE_ID);
        interaction.member.voice.channel.permissionOverwrites.edit(everyone, {
            CONNECT: true
        });
        interaction.reply('**Unlocked!**');
    },
};