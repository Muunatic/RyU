const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bitrate')
    .setDescription('Bitrate voice channel')
    .addNumberOption(option =>
      option.setName('number')
      .setDescription('Berikan angka untuk merubah bitrate')
      .setRequired(true)
    ),
    async execute(interaction) {
        if (!interaction.member.voice.channel) return interaction.reply('**Kamu tidak divoice channel!**');
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply('**Kamu tidak divoice channel yang sama!**');
        const numbervalue = interaction.options.get("number").value;
        if (Math.round(parseInt(numbervalue)) < 8000 || Math.round(parseInt(numbervalue)) > 96000) return interaction.reply('**berikan nomor 8000 - 96000!**');
        interaction.member.voice.channel.setBitrate(numbervalue);
        interaction.reply(`Bitrate telah diubah ke **${numbervalue}**!`);    
    },
};