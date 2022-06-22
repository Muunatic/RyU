const { SlashCommandBuilder } = require('@discordjs/builders');
const { player } = require('../../../../client');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Volume adjustment')
    .addNumberOption(option =>
      option.setName('number')
      .setDescription('Berikan angka untuk mengubah volume')
      .setRequired(true)
    ),
    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply('**Tidak ada music yang berjalan**');
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply('**Kamu tidak divoice channel yang sama!**');
        const numbervalue = interaction.options.get("number").value;
        if (Math.round(parseInt(numbervalue)) < 1 || Math.round(parseInt(numbervalue)) > 100) return interaction.reply('berikan nomor 1 - 100 !');
        queue.setVolume(numbervalue);
        interaction.reply(`Volume telah diubah ke ${numbervalue}%`);
    },
};