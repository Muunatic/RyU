const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock voice channel'),
    async execute(interaction) {
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        let everyone = interaction.member.guild.roles.cache.get(process.env.EVERYONE_ID);
        interaction.member.voice.channel.permissionOverwrites.edit(everyone, {
            CONNECT: false
        });
        interaction.reply('**Locked!**');
    },
};