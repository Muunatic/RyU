const { SlashCommandBuilder } = require('@discordjs/builders');
const { player, QueueRepeatMode } = require('../../../../client');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Repeat music'),
    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('**Tidak ada music yang berjalan**');
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply('**Kamu tidak divoice channel yang sama!**');
        const repeatmode = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);
        interaction.reply(repeatmode ? `Loop **${queue.repeatMode === 0 ? 'dimatikan' : 'dinyalakan'}**` : `Repeat mode **${queue.repeatMode === 0 ? 'dimatikan' : 'dinyalakan'}**`);
    },
};