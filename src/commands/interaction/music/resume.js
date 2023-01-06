const { SlashCommandBuilder } = require('@discordjs/builders');
const { player } = require('../../../../client');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume music'),
    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('**Tidak ada music yang berjalan**');
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply('**Kamu tidak divoice channel yang sama!**');
        if (queue.setPaused(false)) return interaction.reply('**Lagu sedang berlangsung**');
        queue.setPaused(false);
        interaction.reply('**Lagu dilanjutkan**');
    },
};