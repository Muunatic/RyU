const { SlashCommandBuilder } = require('@discordjs/builders');
const { player } = require('../../../../client');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause music'),
    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('**Tidak ada music yang berjalan**');
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply('**Kamu tidak divoice channel yang sama!**');
        if (queue.setPaused(true)) return interaction.reply('**Lagu sedang dipause**');
        queue.setPaused(true);
        interaction.reply('**Lagu telah dipause**');
    },
};